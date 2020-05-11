import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

// Get the following values from:
//      Firebase Console >> Project Settings >> Your Apps >> (your web app) >> Config
const firebaseConfig = {
  apiKey: "XXXX",
  authDomain: "XXXX",
  databaseURL: "XXXX",
  projectId: "XXXX",
  storageBucket: "XXXX",
  messagingSenderId: "XXXX",
  appId: "XXXX",
  measurementId: "XXXX"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
