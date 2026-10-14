// Optional browser checks: start Chrome with --remote-debugging-port=9224.
import { writeFile } from 'node:fs/promises'
const [origin = 'http://127.0.0.1:8091', label = 'current'] = process.argv.slice(2)
const tab = await (await fetch(`${process.env.CDP_URL || 'http://127.0.0.1:9224'}/json/new?about:blank`, { method: 'PUT' })).json()
const ws = new WebSocket(tab.webSocketDebuggerUrl)
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }))
let id = 0
const pending = new Map(), errors = []
ws.addEventListener('message', ({ data }) => {
  const m = JSON.parse(data)
  if (m.id) { pending.get(m.id)?.(m); pending.delete(m.id) }
  else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params)
})
const send = (method, params = {}) => new Promise((resolve, reject) => {
  pending.set(++id, m => m.error ? reject(m.error) : resolve(m.result))
  ws.send(JSON.stringify({ id, method, params }))
})
const wait = ms => new Promise(r => setTimeout(r, ms))
const evaluate = async expression => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails))
  return result.result.value
}
await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable'); await send('Performance.enable')
await send('Network.setCacheDisabled', { cacheDisabled: true })
await send('Emulation.setCPUThrottlingRate', { rate: 4 })
const report = { origin, label, pages: [], errors }
for (const width of [1440, 390]) {
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 })
  for (const path of ['/', '/about/', '/knowledge/', '/knowledge/project-template/']) {
    await send('Page.navigate', { url: origin + path }); await wait(2000)
    await evaluate('document.fonts.ready'); await wait(300)
    const page = await evaluate(`({path:location.pathname, width:innerWidth, overflow:document.documentElement.scrollWidth>innerWidth, resources:performance.getEntriesByType('resource').map(r=>({name:r.name.split('/').pop(),bytes:r.encodedBodySize})), paints:performance.getEntriesByType('paint').map(p=>({name:p.name,start:p.startTime}))})`)
    if (page.overflow) throw Error('Horizontal overflow ' + path)
    report.pages.push(page)
    const name = path.replaceAll('/', '_')
    const shot = await send('Page.captureScreenshot', { format: 'png' })
    await writeFile(`/tmp/vice-${label}-${width}-${name}.png`, Buffer.from(shot.data, 'base64'))
    if (path !== '/') continue
    await evaluate(`window.__mutations=0;window.__observer=new MutationObserver(ms=>window.__mutations+=ms.length);window.__observer.observe(document.querySelector('.vp-home'),{subtree:true,attributes:true,attributeFilter:['style']})`)
    const before = (await send('Performance.getMetrics')).metrics
    const scroll = await evaluate(`new Promise(resolve=>{const home=document.querySelector('.vp-home');const max=home.scrollHeight-home.clientHeight;const times=[];let start,last;function step(now){start??=now;if(last)times.push(now-last);last=now;home.scrollTop=Math.min(1,(now-start)/2500)*max;if(now-start<2500)requestAnimationFrame(step);else resolve({frames:times.length,p95:times.sort((a,b)=>a-b)[Math.floor(times.length*.95)],max})}requestAnimationFrame(step)})`)
    const after = (await send('Performance.getMetrics')).metrics
    page.scroll = { ...scroll, mutations: await evaluate('window.__observer.disconnect(); window.__mutations') }
    for (const metric of ['LayoutCount','RecalcStyleCount','LayoutDuration','RecalcStyleDuration','TaskDuration']) page.scroll[metric] = after.find(m=>m.name===metric).value-before.find(m=>m.name===metric).value
    for (const fraction of [0, .25, .5, .75, 1]) {
      await evaluate(`document.querySelector('.vp-home').scrollTop=${fraction}*(document.querySelector('.vp-home').scrollHeight-document.querySelector('.vp-home').clientHeight)`)
      await wait(150)
      const shot = await send('Page.captureScreenshot', { format: 'png' })
      await writeFile(`/tmp/vice-${label}-${width}-scroll-${fraction}.png`, Buffer.from(shot.data, 'base64'))
    }
  }
}
await send('Emulation.setCPUThrottlingRate', { rate: 1 })
await writeFile(`/tmp/vice-${label}.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ errors, scroll:report.pages.filter(p=>p.scroll).map(p=>({width:p.width,...p.scroll})),homeBytes:report.pages[0].resources.reduce((n,r)=>n+r.bytes,0) }, null, 2))
await send('Target.closeTarget', { targetId: tab.id })
ws.close()
