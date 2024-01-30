
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA0pvc_FKN-c5qsY_Lb4tqVGDtK7pz3fbg",
  authDomain: "localeventure.firebaseapp.com",
  projectId: "localeventure",
  storageBucket: "localeventure.appspot.com",
  messagingSenderId: "952018081316",
  appId: "1:952018081316:web:d8898e7156da39fb682ab1",
  measurementId: "G-CDHGZRJMTL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
