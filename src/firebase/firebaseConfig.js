// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Import Firebase Auth
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvZC6OVAxWTOBUxN8ioK9GdgX-3VclW4c",
  authDomain: "inventory-f37a5.firebaseapp.com",
  projectId: "inventory-f37a5",
  storageBucket: "inventory-f37a5.appspot.com",
  messagingSenderId: "570068404002",
  appId: "1:570068404002:web:7d64fa1dd52062bb13c77b"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Authentication and export it
const auth = getAuth(app);
const db = getFirestore(app);

export { auth,db };

