// Import the functions you need from the SDKs you needW
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider, 
  getAuth, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  sendEmailVerification,
  onAuthStateChanged 
}
from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCxvv8uFc2r2kmPD5DWFb-EHlWNujPH26Q",
  authDomain: "how2meetntt.firebaseapp.com",
  databaseURL: "https://how2meetntt-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "how2meetntt",
  storageBucket: "how2meetntt.appspot.com",
  messagingSenderId: "1046389146594",
  appId: "1:1046389146594:web:433ada55bd2cbb3a47efbb"
};

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
  } catch (err: any) {
    MySwal.fire({
      icon: 'error',
      title: 'Error...',
      text: err.message,
    })
  }
};

const logInWithEmailAndPassword = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const registerWithEmailAndPassword = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
  .then((user: any) => {
    if (auth.currentUser) {
      sendEmailVerification(auth.currentUser)
      .then((result: any) => {
        
      })
      .catch((err: any) => {
        MySwal.fire({
          icon: 'error',
          title: 'Error...',
          text: err.message,
        })
      });
    }
  });
};

const sendVerificationEmail = async(user: any) => {
  return sendEmailVerification(user);
}

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err: any) {
    MySwal.fire({
      icon: 'error',
      title: 'Error...',
      text: err.message,
    })
  }
};

const logout = () => {
  signOut(auth);
  localStorage.setItem("firebaseLoggedIn", "0");
};

const storage = getStorage(app);

export {
  auth,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  sendVerificationEmail,
  onAuthStateChanged,
  storage
};