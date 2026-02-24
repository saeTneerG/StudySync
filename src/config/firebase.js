import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCorhbD50n4HxavU25pAQ-EXqH4j2jfD0I",
    authDomain: "studysync-f125f.firebaseapp.com",
    projectId: "studysync-f125f",
    storageBucket: "studysync-f125f.firebasestorage.app",
    messagingSenderId: "947924532703",
    appId: "1:947924532703:web:21bc8756bfdc93396d186a"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
