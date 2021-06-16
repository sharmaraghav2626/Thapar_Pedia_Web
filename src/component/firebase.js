// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';
const fireBase=firebase.initializeApp({
    apiKey: "AIzaSyBnw1AEdCJpTLuWgCp2ViDG8712LjBYEdI",
    authDomain: "thapar-pedia.firebaseapp.com",
    projectId: "thapar-pedia",
    storageBucket: "thapar-pedia.appspot.com",
    messagingSenderId: "762144958410",
    appId: "1:762144958410:web:80032097a9bb56886f5133",
    measurementId: "G-E3RH7PWZ5V"
});
const auth=fireBase.auth();
const provider=new firebase.auth.GoogleAuthProvider();
const db=fireBase.firestore();
const storage=fireBase.storage();
export {auth,provider,storage};
export default db;
