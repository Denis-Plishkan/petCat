import JustValidate from 'just-validate';
import { auth, signInWithEmailAndPassword } from './modules/firebase-Сonfig';
import './modules/facebook-login';
import './modules/google-login';

function checkUserAdmin(email, password) {
  return email === 'admin@mail.com' && password === 'qwe123456';
}

const authForm = document.getElementById('authForm');
const validator = new JustValidate(authForm);
validator
  .addField('#loginEmail', [
    {
      rule: 'required',
    },
    {
      rule: 'customRegexp',
      value: /^[a-zA-Z0-9.-]+@[^\s@]+\.[\p{L}]{2,}$/u,
      errorMessage: 'Email is invalid',
    },
  ])

  .addField('#loginPassword', [
    {
      rule: 'required',
    },
    {
      rule: 'password',
    },
  ]);

if (authForm) {
  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const isValid = validator.validate();

    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

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
    const errorMessageElement = document.getElementById('errorMessage');
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
        error.code === 'auth/invalid-email' ||
        error.code === 'auth/wrong-password'
      ) {
      } else {
        alert('Неправильный email или пароль');
        console.error(' Oшибка:', error);
      }
    } finally {
      authForm.querySelector('button').disabled = false;
    }
  });
}

export async function onAuthStateChange(auth, user) {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    const userQuery = collection(db, 'users');
    const userSnapshot = await getDocs(userQuery);
    const existingUser = userSnapshot.docs.find(
      (doc) => doc.data().uid === user.uid
    );

    if (!existingUser) {
      window.location.href = 'login.html';
    } else {
      const isAdmin = existingUser.data().isAdmin;

      if (!isAdmin) {
        const errorMessage = 'Куда мы лезим?';
        const errorMessageContainer = document.getElementById('errorMessage');

        if (errorMessageContainer) {
          errorMessageContainer.textContent = errorMessage;
        } else {
          const errorContainer = document.createElement('div');
          errorContainer.id = 'errorMessage';
          errorContainer.textContent = errorMessage;
          errorContainer.style.color = 'red';
          document.body.appendChild(errorContainer);
        }

        window.location.href = 'index.html';
      }
    }
  }
}
