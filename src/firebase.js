
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwkRmSmnou6FRKhDxoF1Mj__j4HgYyUyU",
  authDomain: "backup-97727.firebaseapp.com",
  projectId: "backup-97727",
  storageBucket: "backup-97727.firebasestorage.app",
  messagingSenderId: "936408612808",
  appId: "1:936408612808:web:9d6d3e991f6c09150b4afd",
  measurementId: "G-RBJ9P1XBVY"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };