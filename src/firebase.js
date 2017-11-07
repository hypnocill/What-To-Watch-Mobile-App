import firebase from 'firebase';

try {
  const config = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    storageBucket: '',
    messagingSenderId: ''
  };

  firebase.initializeApp(config);
} catch (e) {
  alert(`Can't connect to database: ${e}`);
}

export let firebaseRef = firebase.database().ref();
export let FBprovider = new firebase.auth.FacebookAuthProvider();

export default firebase;
