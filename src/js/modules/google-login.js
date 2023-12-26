import { auth } from './firebase-Config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

document.getElementById('google-login').addEventListener('click', function () {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;

      alert('Welcome ' + user.displayName);
      console.log(user);

      const localUserData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
      };
      localStorage.setItem('user', JSON.stringify(localUserData));

      window.location.href = 'index.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
});
