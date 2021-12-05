import {getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";



// TODO: Replace the following with your app's Firebase project configuration
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
const provider = new GoogleAuthProvider();

onAuthStateChanged(auth, user => {
    if(user != null){
        console.log('logged in');
    }else{
        console.log("Nouser");
    }
})

function googleLogin(){
    console.log("Login");
    signInWithPopup(auth, provider).then(res=>{
        console.log(res["user"]["email"]);
        localStorage.setItem("email",res["user"]["email"]);
        todoPage();
    });
}

function todoPage(){
    window.location.href = "../../index.html";
}

document.getElementById("login").addEventListener("click",googleLogin);

