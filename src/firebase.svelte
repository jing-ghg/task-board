<script>
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";


// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyAF5f2wAjujeKxDplwgm62z_MorSDx7waM",
    authDomain: "delvify-2eaf2.firebaseapp.com",
    projectId: "delvify-2eaf2",
    storageBucket: "delvify-2eaf2.appspot.com",
    messagingSenderId: "537821094530",
    appId: "1:537821094530:web:3813317844ebd44f054a9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export async function addUsers(){
    try{
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }} 



	

</script>