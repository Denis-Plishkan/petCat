import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA98uniRsm9RWCyTgE6RdWDF6tVgPqCccw',
  authDomain: 'vetcat-2880a.firebaseapp.com',
  databaseURL: 'https://vetcat-2880a-default-rtdb.firebaseio.com',
  projectId: 'vetcat-2880a',
  storageBucket: 'vetcat-2880a.appspot.com',
  messagingSenderId: '738330368561',
  appId: '1:738330368561:web:29c125cd7cfb0dda67d310',
  measurementId: 'G-3Y0WBP9XT8',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
console.log(auth);

// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {

//     const user = userCredential.user;

//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;

//   });
