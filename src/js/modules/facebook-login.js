import { auth } from './firebase-Config';
import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';

const facebookProvider = new FacebookAuthProvider();

document
  .getElementById('facebook-login')
  .addEventListener('click', function () {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        const user = result.user;

        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        alert('Welcome ' + user.displayName);
        console.log(user);
        window.location.href = 'index.html';
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);
      });
  });
