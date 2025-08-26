import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDyh0oVsQHMFDKhO2u3dJV7w-wOjv1yFCE",
    authDomain: "bardaguloan.firebaseapp.com",
    databaseURL: "https://bardaguloan-default-rtdb.firebaseio.com",
    projectId: "bardaguloan",
    storageBucket: "bardaguloan.firebasestorage.app",
    messagingSenderId: "1068429609698",
    appId: "1:1068429609698:web:ace92a4f04b853d8dfecbb"
};
// Initialize Firebase only if it hasn't been initialized yet
// let app;
// if (!getApps().length) {

// } else {
//     app = getApp();
// }
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };
export default app;