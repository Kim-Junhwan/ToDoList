const clockTitle = document.querySelector(".js-date");

function getTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  clockTitle.innerText = `${year}년 ${month}월 ${day}일`;
}

function init() {
  getTime();
  setInterval(getTime, 1000);
}

init();
