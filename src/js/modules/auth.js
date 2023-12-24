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
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from 'firebase/firestore/lite';

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
const provider = new FacebookAuthProvider();

console.log(provider);
console.log(auth);

const signupForm = document.getElementById('signupForm');

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
  errorsContainer: document.querySelector('errors-container'),
};

const dictLocale = [
  {
    key: 'en', // код языка
    dict: {
      required: 'This field is required', // текст для обязательного поля
      email: 'Please enter a valid email address', // текст для неверного email
    },
  },
  {
    key: 'ru', // код языка
    dict: {
      required: 'Это поле обязательно', // текст для обязательного поля
      email: 'Пожалуйста, введите корректный адрес электронной почты', // текст для неверного email
    },
  },
];

validator
  .addField('#firstname', [
    {
      rule: 'required',
    },
    {
      rule: 'minLength',
      value: 2,
    },
    {
      rule: 'maxLength',
      value: 15,
    },
  ])
  .addField('#lastname', [
    {
      rule: 'required',
    },
    {
      rule: 'minLength',
      value: 2,
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
  ]);

document.getElementById('firstname').addEventListener('input', function () {
  const value = this.value.trim();
  if (!/^[A-Za-z]+$/.test(value)) {
    this.setCustomValidity('Поле должно содержать только буквы');
  } else {
    this.setCustomValidity('');
  }
  validator.validateInput(this);
});

document.getElementById('lastname').addEventListener('input', function () {
  const value = this.value.trim();
  if (!/^[A-Za-z]+$/.test(value)) {
    this.setCustomValidity('Поле должно содержать только буквы');
  } else {
    this.setCustomValidity('');
  }
  validator.validateInput(this);
});

if (signupForm) {
  signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();

  if (validator.validate()) {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const firstName = document.getElementById('firstname').value.trim();
    const lastName = document.getElementById('lastname').value.trim();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const firstName = document.getElementById('firstname').value.trim();
    const lastName = document.getElementById('lastname').value.trim();

    //пересмотреть
    //   const nameRegex = /^[a-zA-Z\s]*$/;

    //   if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    //     alert('Имя и фамилия могут содержать только буквы и пробелы.');
    //     return;
    //   }

    //   if (firstName.length > 12 || lastName.length > 12) {
    //     alert('Имя и фамилия не должны превышать 12 символов.');
    //     return;
    //   }

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
        firstName: firstName,
        lastName: lastName,
      });

      console.log(
        'Шаг 2: Данные пользователя успешно добавлены в Firestore:',
        userDocRef.email
      );

      const localUserData = {
        uid: user.uid,
        email: user.email,
        firstName: firstName,
        lastName: lastName,
      };
      localStorage.setItem('user', JSON.stringify(localUserData));

      signupForm.querySelector('button').disabled = true;
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
      console.log('Пользователь успешно зарегистрирован:', user);
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Ошибка регистрации:', error.code, error.message);
    } finally {
      signupForm.querySelector('button').disabled = false;
    }
  });
}

// //////
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
      window.location.href = 'index.html';
    } catch (error) {
      console.error('Ошибка входа:', error.code, error.message);
    } finally {
      authForm.querySelector('button').disabled = false;
    }
  });
}

//Регистрация новых пользователей
// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });

// Войти существующих пользователей
//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       // ...
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//     });

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

//Facebook регистрация

//   signInWithPopup(auth, provider)
//     .then((result) => {
//       // The signed-in user info.
//       const user = result.user;

//       // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//       const credential = FacebookAuthProvider.credentialFromResult(result);
//       const accessToken = credential.accessToken;

//       // IdP data available using getAdditionalUserInfo(result)
//       // ...
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.customData.email;
//       // The AuthCredential type that was used.
//       const credential = FacebookAuthProvider.credentialFromError(error);

//       // ...
//     });
//   getRedirectResult(auth)
//     .then((result) => {
//       // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//       const credential = FacebookAuthProvider.credentialFromResult(result);
//       const token = credential.accessToken;

//       const user = result.user;
//       // IdP data available using getAdditionalUserInfo(result)
//       // ...
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.customData.email;
//       // AuthCredential type that was used.
//       const credential = FacebookAuthProvider.credentialFromError(error);
//       // ...
//     });

//----- facebook login code start

// FB.getLoginStatus(function (response) {
//   statusChangeCallback(response);
// });

// document
//   .getElementById('facebook-login')
//   .addEventListener('click', function () {
//     signInWithPopup(auth, provider)
//       .then((result) => {
//         // The signed-in user info.
//         const user = result.user;

//         // This gives you a Facebook Access Token. You can use it to access the Facebook API.
//         const credential = FacebookAuthProvider.credentialFromResult(result);
//         const accessToken = credential.accessToken;

//         alert('Welcome ' + user.displayName);
//         console.log(user);
//         // ...
//       })
//       .catch((error) => {
//         // Handle Errors here.
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         // console.log(errorMessage);
//         console.error(errorMessage);
//         // The email of the user's account used.
//         const email = error.customData.email;
//         // The AuthCredential type that was used.
//         const credential = FacebookAuthProvider.credentialFromError(error);

//         // ...
//       });
//   });
