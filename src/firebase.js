import { initializeApp } from "firebase/app";
import{ getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlz2hak9pDqHqZBTts_gUR9T2kRbfWrTs",
  authDomain: "it64finaloutput.firebaseapp.com",
  projectId: "it64finaloutput",
  storageBucket: "it64finaloutput.appspot.com",
  messagingSenderId: "584094187367",
  appId: "1:584094187367:web:a6b312bf1f4e07676179c2",
  measurementId: "G-JWH3ZLXM8S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };