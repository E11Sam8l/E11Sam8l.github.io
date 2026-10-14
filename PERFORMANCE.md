# GitHub Pages 性能记录

验证日期：2026-10-14。保留现有布局、颜色、字体、图片、滚动轨迹和 1200ms 圆形转场。

## 实测结果

使用同一台机器的 Chrome Headless（关闭 GPU）、4 倍 CPU 降速、关闭 HTTP 缓存；视口为 1440×900 和 390×900。首页用 `requestAnimationFrame` 在 2.5 秒内滚过全部三个章节。数值反映本地生产构建的对比，不代表所有手机或 GitHub Pages 实际网络的帧率。

| 指标 | 优化前 | 优化后 | 变化 |
| --- | ---: | ---: | ---: |
| 首屏必需 JS（HTML 的 modulepreload 总和，未压缩） | 411,651 B | 363,636 B | −11.7% |
| 桌面滚动样式计算时间 | 296.7 ms | 134.9 ms | −54.5% |
| 手机视口滚动样式计算时间 | 286.7 ms | 140.4 ms | −51.0% |
| 桌面滚动主线程任务时间 | 668.8 ms | 402.2 ms | −39.9% |
| 手机视口滚动主线程任务时间 | 610.4 ms | 418.5 ms | −31.4% |
| 滚动样式属性变更次数 | 668 | 473 | −29.2% |
| 滚动期间 Layout 次数 | 0 | 0 | 保持 |

两版的滚动帧间隔 P95 均约 16.7 ms；优化主要增加了主线程余量。完整发布目录约 3.28 MiB，增加的预加载和恢复逻辑会使总文件体积略有增加，首屏必要脚本和滚动计算量则减少。

对比了首页、关于页、知识库列表、正文，以及首页 0%、25%、50%、75%、100% 滚动位置，共 18 张桌面/手机截图。17 张逐像素一致；另一张仅有侧栏图标 5 个像素的色值相差 1/255，属于栅格化差异，无布局或视觉内容变化。

## 实现

- 首页对真正参与动画的元素更新 `transform`、`opacity`，避免章节根节点上的继承变量使全部后代重复计算样式。缓存几何数据和已写值，合并窗口尺寸与 ResizeObserver 更新；静止时没有持续动画循环。
- 栏目列表、关于页和正文菜单按需加载。主题的 SHA-256/bcrypt WebAssembly 延迟到实际使用密码功能时加载，保留原有校验结果。
- 首屏加载结束后，在空闲时间逐个准备主要入口页面；指针悬停、键盘焦点和触摸意图也会准备目标页面。省流模式、2G 网络和后台标签页停止主动预取，不遍历全站文章、附件或搜索索引。
- 点击后先准备目标页面模块，再开始原有转场。关于页头像在切换前尝试解码；字体和已挂载图片也有有界等待。
- 超过 180ms 的导航等待显示与本站配色一致的旋转缓冲标志。模块准备超过 8 秒或失败时显示“刷新重试”，保留原页面；重试会获取最新 HTML，也能处理部署更新后旧分块地址失效的情况。图片等待有独立上限，缺图不会永久挡住页面。
- 预加载主题已经使用的 Inter 普通拉丁字体，复用其原始文件及内容哈希；不提前请求扩展字符集和斜体字体。
- 保留搜索自己的弹窗关闭和历史记录逻辑，程序化导航仍使用现有入场动画。
- GitHub Actions 在上传产物前验证静态资源地址及性能预算。没有添加浏览器运行时依赖。

目前优化已降低实际计算开销，因此首页正常进入。缓冲用于确实尚未准备好的切页，不要求访客等待所有文章下载完才看到首页。

## 验证覆盖

`pnpm test` 的 24 项测试通过，包括内容导航、筛选、密码校验兼容性和资源超时。浏览器检查覆盖慢网络（350ms 延迟、80KB/s、4 倍 CPU 降速）、头像解码、正反向圆形转场、返回导航、主题切换、中文搜索、分块加载失败与重试、手机菜单、减少动态效果以及不支持 View Transitions 时的回退。

生产构建及 21 个 HTML 页面的静态资源检查通过，`/` 与 `/preview/` 部署路径均已验证，子目录下的首页、关于页、返回和栏目导航通过浏览器检查。

## 本地复测

```bash
pnpm test
pnpm build
pnpm verify:pages
```

`verify:pages` 的预算为首屏必需 JS 400 KiB、全部 CSS 350 KiB。以后有意增加较大功能时，先核对构建报告，再调整 `scripts/check-pages.mjs` 中的预算。GitHub Pages 的发布大小和带宽限制见 [GitHub 官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)。

浏览器复测使用 Node.js 24 的 WebSocket 和 Chrome 调试协议，不需要安装测试框架。分别在终端启动生产预览和一个独立的测试浏览器：

```bash
python3 -m http.server 8091 --bind 127.0.0.1 --directory docs/.vuepress/dist
```

```bash
google-chrome --headless=new --disable-gpu --remote-debugging-port=9224 --user-data-dir=/tmp/vice-perf-check about:blank
```

然后运行：

```bash
pnpm verify:browser
pnpm perf:browser http://127.0.0.1:8091 current
```

浏览器端口可用 `CDP_URL` 环境变量指定。性能结果保存在 `/tmp/vice-current.json`，截图为 `/tmp/vice-current-*.png`。基准比较时使用不同标签与独立的原版构建目录，并顺序运行，避免其他浏览器测试干扰测量。

检查仓库子路径：

```bash
DOCS_BASE=/preview/ pnpm build --dest /tmp/vice-subpath/preview
DOCS_BASE=/preview/ node scripts/check-pages.mjs /tmp/vice-subpath/preview
```

上线使用仓库现有的 GitHub Actions 工作流。修改尚需提交并推送后才会发布；本地测试不会更改线上站点。
