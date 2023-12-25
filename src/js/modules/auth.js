import './firebase-Config';

function checkUserAdmin(email, password) {
  return email === 'admin@mail.com' && password === '123456';
}

const authForm = document.getElementById('authForm');

if (authForm) {
  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const localUserData = {
        uid: user.uid,
        email: user.email,
      };
      localStorage.setItem('user', JSON.stringify(localUserData));

      alert('Вы успешно вошли в систему!');

      authForm.querySelector('button').disabled = true;

      console.log('Пользователь успешно вошел:', user);
      if (checkUserAdmin(user.email, password)) {
        window.location.href = 'admin-page.html';
      } else {
        window.location.href = 'index.html';
      }
    } catch (error) {
      console.error('Ошибка входа:', error.code, error.message);
    } finally {
      authForm.querySelector('button').disabled = false;
    }
  });
}

document
  .getElementById('facebook-login')
  .addEventListener('click', function () {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        alert('Welcome ' + user.displayName);
        console.log(user);
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
