import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyBYzldBeppO6FNslFSd-T5v0b18RxKs3cE",
    authDomain: "react-users-80a86.firebaseapp.com",
    databaseURL: "https://react-users-80a86.firebaseio.com",
    projectId: "react-users-80a86",
    storageBucket: "react-users-80a86.appspot.com",
    messagingSenderId: "223992280104"
};
firebase.initializeApp(config);
export default firebase;