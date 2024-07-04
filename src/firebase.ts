// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLb-VYApaCLH-O9DGJSZzIHYAvZMh8WnI",
  authDomain: "rubnong-acdb0.firebaseapp.com",
  projectId: "rubnong-acdb0",
  storageBucket: "rubnong-acdb0.appspot.com",
  messagingSenderId: "14897178096",
  appId: "1:14897178096:web:ed80f1244b402c80cb2935",
  measurementId: "G-PQEHT5EL5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);