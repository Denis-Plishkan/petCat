import JustValidate from 'just-validate';
import {
  auth,
  createUserWithEmailAndPassword,
  addDoc,
  collection,
  firebaseConfig,
  db,
} from './modules/firebase-Сonfig';
import './modules/facebook-login';
import './modules/google-login';

const signupForm = document.getElementById('signupForm');
const validator = new JustValidate(signupForm);

validator
  .addField('#fullName', [
    {
      rule: 'required',
    },

    {
      rule: 'minLength',
      value: 4,
    },
    {
      rule: 'maxLength',
      value: 24,
    },
  ])

  .addField('#signupEmail', [
    {
      rule: 'required',
    },
    {
      rule: 'customRegexp',
      value: /^[a-zA-Z0-9.-]+@[^\s@]+\.[\p{L}]{2,}$/u,
      errorMessage: 'Email is invalid',
    },
  ])

  .addField('#signupPassword', [
    {
      rule: 'required',
    },
    {
      rule: 'password',
    },
  ])

  .addField('#repeatPassword', [
    {
      validator: (value, fields) => {
        if (fields['#signupPassword'] && fields['#signupPassword'].elem) {
          const repeatPasswordValue = fields['#signupPassword'].elem.value;

          return value === repeatPasswordValue;
        }

        return true;
      },
      errorMessage: 'Passwords should be the same',
    },
  ]);

if (signupForm) {
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    if (!agreeTermsCheckbox.checked) {
      alert('Вы должны согласиться с условиями перед регистрацией.');
      return;
    }
    console.log(validator.isValid);
    if (validator.isValid) {
      const fullName = document.getElementById('fullName').value.trim();

      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log('Шаг 1: Пользователь успешно создан:', user);

        const userDocRef = await addDoc(collection(db, 'users'), {
          uid: user.uid,
          email: user.email,
          fullname: fullName,
          isAdmin: false,
        });

        console.log(
          'Шаг 2: Данные пользователя успешно добавлены в Firestore:',
          userDocRef.email
        );

        const localUserData = {
          uid: user.uid,
          email: user.email,
          fullname: fullName,
        };
        localStorage.setItem('user', JSON.stringify(localUserData));

        signupForm.querySelector('button').disabled = true;

        console.log('Пользователь успешно зарегистрирован:', user);
        window.location.href = 'index.html';
      } catch (error) {
        console.error('Ошибка регистрации:', error.code, error.message);
      } finally {
        signupForm.querySelector('button').disabled = false;
      }
    }
  });
}
