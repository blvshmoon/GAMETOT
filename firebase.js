// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔑 CONFIG PROJECT KAMU
const firebaseConfig = {
  apiKey: "AIzaSyCjmjvMxFB8eDRYmyvSldsiBNJBs5fBGEQ",
  authDomain: "uler-tangga-td.firebaseapp.com",
  databaseURL: "https://uler-tangga-td-default-rtdb.firebaseio.com",
  projectId: "uler-tangga-td",
  storageBucket: "uler-tangga-td.firebasestorage.app",
  messagingSenderId: "973713138088",
  appId: "1:973713138088:web:fefaee5ba83d9069833d9d",
  measurementId: "G-5MYNCHJHW9"
};

// 🔥 INIT FIREBASE (AMAN)
let db = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  console.log("Firebase berhasil connect ✅");
} catch (error) {
  console.error("Firebase error ❌:", error);
}

// 📦 EXPORT (biar bisa dipakai di script.js)
export { db, ref, set, onValue, update };
