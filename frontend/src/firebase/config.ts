// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAVreIiL404TauXnoJsd6iN0tWXZb2H_hY",
  authDomain: "diplomovka-dbec5.firebaseapp.com",
  projectId: "diplomovka-dbec5",
  storageBucket: "diplomovka-dbec5.appspot.com",
  messagingSenderId: "585690128533",
  appId: "1:585690128533:web:4cad0a37da253b48f1fb9c",
  measurementId: "G-XV7EQ13FEP",
};
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
