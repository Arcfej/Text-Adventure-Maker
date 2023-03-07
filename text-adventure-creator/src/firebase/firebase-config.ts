// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDNbjr64-IU6EFm3Lyu_vbFe0KNIhfcHAw",
    authDomain: "textual-adventure-creator.firebaseapp.com",
    projectId: "textual-adventure-creator",
    storageBucket: "textual-adventure-creator.appspot.com",
    messagingSenderId: "29072429306",
    appId: "1:29072429306:web:2a73e3e1544ad0cb0e3943",
    measurementId: "G-DYY9Z5FZ89"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firebaseAuth = getAuth(app);
