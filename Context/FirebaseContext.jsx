import { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: "AIzaSyAIm5alhNLkHMQ2bPMce5yDWzhU22I_lpg",
  authDomain: "new-app-8ebf8.firebaseapp.com",
  databaseURL: "https://new-app-8ebf8-default-rtdb.firebaseio.com",
  projectId: "new-app-8ebf8",
  storageBucket: "new-app-8ebf8.firebasestorage.app",
  messagingSenderId: "191239176770",
  appId: "1:191239176770:web:0a40eb249e3c183f2563db",
};
export const app = initializeApp(firebaseConfig);
export const useFirebase = () => useContext(FirebaseContext);
const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const storage = getStorage();
export const db = getFirestore();
const googleProvider = new GoogleAuthProvider();

export const FirebaseProvider = ({ children }) => {
  const signUpwithEandP = (email, password) =>
    createUserWithEmailAndPassword(firebaseAuth, email, password);
  const loginWithEandP = (email, password) =>
    signInWithEmailAndPassword(firebaseAuth, email, password);

  const signinWithGoogle = () => signInWithPopup(firebaseAuth, googleProvider);

  return (
    <FirebaseContext.Provider
      value={{ signUpwithEandP, loginWithEandP, signinWithGoogle }}>
      {children}
    </FirebaseContext.Provider>
  );
};
