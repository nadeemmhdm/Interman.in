
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

export const firebaseConfig = {
    apiKey: "AIzaSyDBbNZ8NofTKKWNfOmg3-NqAv_9YQ6CbQk",
    authDomain: "interman-study-abroad.firebaseapp.com",
    projectId: "interman-study-abroad",
    storageBucket: "interman-study-abroad.firebasestorage.app",
    messagingSenderId: "367645482214",
    appId: "1:367645482214:web:57d2906a4d0799189caf27",
    measurementId: "G-577MSMB817"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
