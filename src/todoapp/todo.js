import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";

const firebaseConfig = initializeApp({
  apiKey: "AIzaSyA7CXEFJRr3V60YoilT9dcBqDu_pm69cwg",
  authDomain: "login-6653f.firebaseapp.com",
  projectId: "login-6653f",
  storageBucket: "login-6653f.appspot.com",
  messagingSenderId: "124454773349",
  appId: "1:124454773349:web:15a241d907a4918c99dc8c",
  measurementId: "G-1EN7228W6P"
});

const auth = getAuth();
const toDoForm = document.querySelector(".js-toDoForm"),
  toDoInput = toDoForm.querySelector("input"),
  toDoList = document.querySelector(".js-toDoList");

const TODOS_LS = `toDos`;
var googleLoginEmail = "";
const URL = "https://wm67futyr3.execute-api.us-east-1.amazonaws.com/default/todolist/"
var todolistItem = [];

async function fetchData(){
  return fetch(URL+googleLoginEmail)
  .then(function(response){
    return response.json();
  })
  .then(function(myJson){
    for (var i=0; i<myJson.length; i++){
      var dict = {};
      dict["_id"] = myJson[i]["_id"];
      dict["googleLoginId"] = myJson[i]["googleLoginId"];
      dict["content"] = myJson[i]["content"];
      dict["date"] = myJson[i]["date"];
      dict["id"] = myJson[i]["id"];
      todolistItem[i] = dict;
    }
    return todolistItem;
  });
}

async function postData(){
  var text = document.getElementById('todoInput').value;
  return fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        "content" : text,
        "googleLoginId" : googleLoginEmail,
    }),
  }).then(function(response){
      if (response != null){
        return true;
      }
  });
}

async function postDataGet(){
  var bool = await postData();
  if (bool) {
    todolistItem = await fetchData();
    console.log(todolistItem);
    deleteDiv(todolistItem.length-1);
    tableViewLoad(todolistItem);
  }
}

async function deleteData(id){
  return fetch(URL+id, {
  method: "DELETE"
}).then(function(response){
  if (response != null){
    return true;
  }
});
}

async function deleteDataGet(event){
  const btn = event.target;
  const li = btn.parentNode;
  const div = li.parentNode;
  var bool = await deleteData(div.id);
  if (bool) {
    location.reload();
  }
}


function handleSubmit(event) {
  event.preventDefault();
}

function deleteDiv(length){
  for(var i=0; i< length;i++){
    var delDivId = document.getElementById(todolistItem[i]["id"]);
    console.log(todolistItem[i]["id"]);
    delDivId.remove();
  }
}

function tableViewLoad(arrList){
  console.log(arrList);
  for (var i=0; i<arrList.length; i++){
    const div = document.createElement("div");
    const li = document.createElement("li"); 
    const delBtn = document.createElement("button"); //지우기 버튼
    const span = document.createElement("span");
    div.classList = "todoitems";
    delBtn.classList.add("fas");
    delBtn.classList.add("fa-times-circle");
    delBtn.addEventListener("click", deleteDataGet);
    span.innerText = arrList[i]["content"];
    li.appendChild(span);
    li.appendChild(delBtn);
    div.id = arrList[i]["id"];
    li.id = arrList[i]["id"];
    div.appendChild(li);
    toDoList.appendChild(div);
  }
}

function goLoginPage(){
  signOut(auth).then(() => {
    window.location.href = "./googlelogin/src/index.html";
    // Sign-out successful.
  }).catch((error) => {
      console.log(error);
  });
  
  
}

 async function main() {
  todolistItem = await fetchData();
  tableViewLoad(todolistItem);
  toDoForm.addEventListener("submit", handleSubmit);
}
window.onload = function(){
  googleLoginEmail = localStorage.getItem("email");
  main();
}

document.getElementById("logout").addEventListener("click",goLoginPage);
document.getElementById("listsave").addEventListener("click",postDataGet);