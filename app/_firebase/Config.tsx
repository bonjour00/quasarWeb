import { getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCLwnmd4ZBfi0fYA7AtVHLcfZyh486slwU",
    authDomain: "qampus-7b72a.firebaseapp.com",
    projectId: "qampus-7b72a",
    storageBucket: "qampus-7b72a.appspot.com",
    messagingSenderId: "950103232939",
    appId: "1:950103232939:web:bc1b5b5378c4dd4aa402ee",
    measurementId: "G-06TQLJFSE9"
};
// Initialize Firebase App
let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;
