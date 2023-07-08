// Import the necessary Firebase SDKs
import * as firebase from 'firebase/app';
import 'firebase/firestore';

// // Initialize Firebase with your credentials
const firebaseConfig = {
  apiKey: "AIzaSyBn-Yl9Trla4DrGeB-ghmW0bUKq2nXrECk",
  authDomain: "cac23-c97d0.firebaseapp.com",
  projectId: "cac23-c97d0",
  storageBucket: "cac23-c97d0.appspot.com",
  messagingSenderId: "1059496786578",
  appId: "1:1059496786578:web:5c360731856484432a044b",
  measurementId: "G-FL3EHTN6CP"
};

// // Initialize Firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Create a Firestore instance
const db = firebase.firestore();

// Define a Nuxt server middleware
export default function(req, res, next) {
  // Fetch data from Firestore
  db.collection('your_collection')
    .get()
    .then(querySnapshot => {
      const data = [];
      querySnapshot.forEach(doc => {
        data.push(doc.data());
      });

      // Pass the fetched data to the Nuxt context
      req.fetchedData = data;

      next();
    })
    .catch(error => {
      console.error('Error fetching data from Firestore:', error);
      next();
    });
}
