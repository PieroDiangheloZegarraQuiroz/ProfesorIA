import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB5F-vHndP6ydvAgQ0pzOBBmCn-IpNWvac",
    authDomain: "ayudaia-c6a37.firebaseapp.com",
    projectId: "ayudaia-c6a37",
    storageBucket: "ayudaia-c6a37.appspot.com",
    messagingSenderId: "425539481701",
    appId: "1:425539481701:web:e5c9ab217e3be5b001568c",
    measurementId: "G-PSBZ3M1ZQ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function() {
        messageDiv.style.opacity = 0;
    }, 5000);
}

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value; // Cambia de Value a value
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
            email: email,
            firstName: firstName,
            lastName: lastName
        };

        // Guardar en Firestore
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
        .then(() => {
            showMessage('Cuenta creada existosamente', 'signUpMessage');
            window.location.href = 'signin.html';
        })
        .catch((error) => {
            console.error("Error de escritura", error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
            showMessage('Cuenta existente!', 'signUpMessage');
        } else {
            showMessage('No se puede crear el usuario', 'signUpMessage');
        }
    });
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event)=>{
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        showMessage('login is successful', 'signInMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href='inicio.html';
    })
    .catch((error)=>{
        const errorCode = error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrect email or password', 'signInMessage');
        }
        else{
            showMessage('Account does not exist', 'signInMessage');
        }
    })
})