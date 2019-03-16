import firebase from 'firebase/app';
import 'firebase/database';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAZJt27A779qk1o0drtYBEAWwYpWQJquYE",
    authDomain: "thymetraveller-37bc8.firebaseapp.com",
    databaseURL: "https://thymetraveller-37bc8.firebaseio.com",
    projectId: "thymetraveller-37bc8",
    storageBucket: "thymetraveller-37bc8.appspot.com",
    messagingSenderId: "446599910222"
};
firebase.initializeApp(config);

export default firebase;