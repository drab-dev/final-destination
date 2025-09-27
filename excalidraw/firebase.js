// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnl3gx0FbYpbMi2f0JyLLV5v6Sb_1fdKQ",
  authDomain: "kroolo-79ee3.firebaseapp.com",
  projectId: "kroolo-79ee3",
  storageBucket: "kroolo-79ee3.firebasestorage.app",
  messagingSenderId: "455419535047",
  appId: "1:455419535047:web:3fc827149a43c580f5e8e2",
  measurementId: "G-YZZRVKH5FV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);