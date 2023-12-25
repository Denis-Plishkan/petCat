import './firebase-Config';
import './facebook-login';
import './google-login';

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
