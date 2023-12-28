import { auth, signInWithEmailAndPassword } from './modules/firebase-Config';
import './modules/facebook-login';
import './modules/google-login';

function checkUserAdmin(email, password) {
  return email === 'admin@mail.com' && password === '123456';
}

const authForm = document.getElementById('authForm');

if (authForm) {
  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Получаем элементы для вывода ошибок
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Сбрасываем предыдущие ошибки
    emailError.textContent = '';
    passwordError.textContent = '';

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      if (!email) {
        emailError.textContent = 'Введите email';
      }
      if (!password) {
        passwordError.textContent = 'Введите пароль';
      }
      return;
    }

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
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    } catch (error) {
      console.error('Ошибка входа:', error.code, error.message);

      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/invalid-email'
      ) {
        emailError.textContent = 'Неправильный email';
        console.error('Ошибка входа: Неправильный email');
      } else if (error.code === 'auth/wrong-password') {
        passwordError.textContent = 'Неправильный пароль';
        console.error('Ошибка входа: Неправильный пароль');
      } else {
        console.error(' Oшибка:', error);
      }
    } finally {
      authForm.querySelector('button').disabled = false;
    }
  });
}
