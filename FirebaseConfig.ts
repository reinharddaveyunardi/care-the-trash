import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB9mXv4RQjlrObn3D8RTgLoed5c_yGXD6U",
    authDomain: "care-the-trash.firebaseapp.com",
    databaseURL: "https://care-the-trash-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "care-the-trash",
    storageBucket: "care-the-trash.appspot.com",
    messagingSenderId: "342432785097",
    appId: "1:342432785097:web:42d3c829cca156a058a318",
    measurementId: "G-N8V4D2P729",
};

// Initialize Firebase
export const FB_APP = initializeApp(firebaseConfig);
export const FB_AUTH = getAuth(FB_APP);
export const FS_DB = getFirestore(FB_APP);
export const FB_STORAGE = getStorage(FB_APP);
