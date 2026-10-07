// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRJnEttigH8e6O44Pfm2Kpx9IJaFr26ak",
  authDomain: "anisha-crypto.firebaseapp.com",
  projectId: "anisha-crypto",
  storageBucket: "anisha-crypto.firebasestorage.app",
  messagingSenderId: "911400155175",
  appId: "1:911400155175:web:96294acc6d8744e3b63602"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };