// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
    apiKey: "AIzaSyAlIqGH7JqRSB5kpXjMYVp0oSdJ2_Td-OA",
    authDomain: "detritus-aa52e.firebaseapp.com",
    projectId: "detritus-aa52e",
    storageBucket: "detritus-aa52e.appspot.com",
    messagingSenderId: "388519823508",
    appId: "1:388519823508:web:d85e437a0fb78f35becc81"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp); // Initialize Firebase Storage

export { auth, db, storage, firebaseApp };
