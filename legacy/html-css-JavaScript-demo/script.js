// 根据 HTML 中的 id，找到需要操作的元素。
const button = document.querySelector("#button");
const countText = document.querySelector("#count");
const card = document.querySelector("#card");

let count = 0;

// 每次点击按钮，浏览器都会执行这个函数。
button.addEventListener("click", () => {
  count += 1;
  countText.textContent = count;         // 更新 HTML 元素里的文字。
  card.classList.toggle("highlight");   // 切换 CSS 类名，改变卡片背景。
});
