import { auth, db, collection, getDocs, addDoc } from './firebase-Config';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

document.getElementById('google-login').addEventListener('click', function () {
  signInWithPopup(auth, googleProvider)
    .then(async (result) => {
      const user = result.user;

      const { displayName, email, uid } = user;

      const userQuery = collection(db, 'users');
      const userSnapshot = await getDocs(userQuery);
      const existingUser = userSnapshot.docs.find(
        (doc) => doc.data().uid === uid
      );

      if (!existingUser) {
        try {
          const userDocRef = await addDoc(collection(db, 'users'), {
            uid: uid,
            email: email,
            fullname: displayName,
            isAdmin: false,
          });

          console.log(
            'Данные пользователя успешно добавлены в Firestore:',
            userDocRef.email
          );
        } catch (error) {
          console.error(
            'Ошибка при добавлении данных пользователя в Firestore:',
            error
          );
        }
      }

      alert('Welcome ' + displayName);
      console.log(user);

      const localUserData = {
        uid: uid,
        displayName: displayName,
        email: email,
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
