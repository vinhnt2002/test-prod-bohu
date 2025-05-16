// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA420pMvK203iunMZu-vDudN6i7GZrp-rg",
  authDomain: "e-com-print.firebaseapp.com",
  projectId: "e-com-print",
  storageBucket: "e-com-print.firebasestorage.app",
  messagingSenderId: "915217100046",
  appId: "1:915217100046:web:5c3cabec172cb14db1bb5f",
  measurementId: "G-LV7D5K925C",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };
