import JustValidate from 'just-validate';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup,
  getRedirectResult,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from 'firebase/firestore/lite';
// import './firebase-Config';

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
const db = getFirestore(app);
const auth = getAuth(app);
const user = auth.currentUser;
const facebookProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();

console.log(facebookProvider);
console.log(auth);

function checkUserAdmin(email, password) {
  return email === 'admin@mail.com' && password === '123456';
}

const signupForm = document.getElementById('signupForm');

const nameInput = document.getElementById('fullName');

const password = document.getElementById('signupPassword');
const repeatPassword = document.getElementById('repeatPassword');
// const retypePassword = document.getElementById('retypePassword').value;

const validator = new JustValidate(signupForm, globalConfig, dictLocale);

const globalConfig = {
  errorFieldStyle: { backgroundColor: 'red' },
  errorFieldCssClass: ['invalid'],
  errorLabelStyle: { backgroundColor: 'red' },
  errorLabelCssClass: ['invalid'],
  successFieldCssClass: ['valid'],
  successFieldStyle: {
    backgroundColor: 'green',
  },
  successLabelCssClass: ['valid'],
  successLabelStyle: {
    backgroundColor: 'green',
  },
  lockForm: false,
  testingMode: true,
  validateBeforeSubmitting: false,
  submitFormAutomatically: true,
  focusInvalidField: false,
  tooltip: {
    position: 'top',
  },
};

const dictLocale = [
  {
    key: 'en',
    dict: {
      required: 'This field is required',
      email: 'Please enter a valid email address',
    },
  },
  {
    key: 'ru',
    dict: {
      required: 'Это поле обязательно',
      email: 'Пожалуйста, введите корректный адрес электронной почты',
    },
  },
];

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
      value: 15,
    },
  ])

  .addField('#signupEmail', [
    {
      rule: 'required',
    },
    {
      rule: 'email',
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

    const password = document.getElementById('signupPassword').value;
    const repeatPassword = document.getElementById('repeatPassword').value;

    if (password !== repeatPassword) {
      alert('Пароли не совпадают.');
      return;
    }

    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    if (!agreeTermsCheckbox.checked) {
      alert('Вы должны согласиться с условиями перед регистрацией.');
      return;
    }

    if (validator.validate()) {
      const fullName = document.getElementById('fullName').value.trim();
      fullName.addEventListener('input', () => {
        validator.validateInput(fullName);
      });
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      // const repeatPassword = document.getElementById('repeatPassword').value;

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
          fullname: fullname,
          isAdmin: false,
        });

        console.log(
          'Шаг 2: Данные пользователя успешно добавлены в Firestore:',
          userDocRef.email
        );

        const localUserData = {
          uid: user.uid,
          email: user.email,
          fullname: fullname,
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
    } else {
      console.log(error.code, error.message);
    }
  });
}

const authForm = document.getElementById('authForm');

if (authForm) {
  authForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      console.log('Заполните все поля');
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
        fullname: user.fullname,
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
    } finally {
      authForm.querySelector('button').disabled = false;
    }
  });
}

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
        const credential = FacebookAuthProvider.credentialFromError(error);
      });
  });

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

// //Установите наблюдателя состояния аутентификации и получите пользовательские данные
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/auth.user
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });
