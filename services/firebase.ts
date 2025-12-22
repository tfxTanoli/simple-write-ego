import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAfCDw5I-Nav1SyPRka9aBLFOQUmCAIwkw",
    authDomain: "simple-write-ego.firebaseapp.com",
    projectId: "simple-write-ego",
    storageBucket: "simple-write-ego.firebasestorage.app",
    messagingSenderId: "383464133970",
    appId: "1:383464133970:web:6d2d72ab95a5ce0556d68b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
