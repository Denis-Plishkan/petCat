import {
  auth,
  db,
  collection,
  addDoc,
  setDoc,
  storage,
  getDocs,
  getDoc,
  onAuthStateChanged,
} from './modules/firebase-config';

import {
  updateContent,
  updateContentPage,
} from './modules/admin/content-admin';

// async function onAuthStateChange(user) {
//   if (!user) {
//     window.location.href = 'login.html';
//   } else {
//     const userQuery = collection(db, 'users');
//     const userSnapshot = await getDocs(userQuery);
//     const existingUser = userSnapshot.docs.find(
//       (doc) => doc.data().uid === user.uid
//     );

//     if (!existingUser) {
//       window.location.href = 'login.html';
//     } else {
//       const isAdmin = existingUser.data().isAdmin;

//       if (!isAdmin) {
//         const errorMessage = 'Куда мы лезим?';
//         const errorMessageContainer = document.getElementById('errorMessage');

//         if (errorMessageContainer) {
//           errorMessageContainer.textContent = errorMessage;
//         } else {
//           const errorContainer = document.createElement('div');
//           errorContainer.id = 'errorMessage';
//           errorContainer.textContent = errorMessage;
//           errorContainer.style.color = 'red';
//           document.body.appendChild(errorContainer);
//         }

//         window.location.href = 'index.html';
//       }
//     }
//   }
// }
onAuthStateChanged(auth, async function (user) {
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
});

// async function usersCount() {
//   const usersCollection = collection(db, 'users');

//   try {
//     const querySnapshot = await getDocs(usersCollection);
//     userCounter = querySnapshot.size;

//     return;
//   } catch (error) {
//     return '?';
//   }
// }
document.addEventListener('DOMContentLoaded', async function () {
  // let userCounter = 0;
  updateContent();
  updateContentPage();

  // window.addEventListener('load', async function () {
  //   await updateContentPage();
  // });
  window.addEventListener('hashchange', async function () {
    await updateContentPage();
  });
});

////2
// const loadDataAndDisplayContent = async () => {
//   await updateContent();

//   initializeServiceForm();
//   initializeEmployeesForm();
//   initializeStoryForm();
//   initializeContactsForm();
//   initializeArticlesForm();

//   const hash = window.location.hash;
//   if (hash.match(/^#\/admin\/services\/(.+)$/)) {
//     const id = hash.split('/').pop().trim();
//     await displayServicePage(id);
//   }
//   if (hash.match(/^#\/admin\/employees\/(.+)$/)) {
//     const id = hash.split('/').pop().trim();
//     await displayEmployeesPage(id);
//   }
//   if (hash.match(/^#\/admin\/articles\/(.+)$/)) {
//     const id = hash.split('/').pop().trim();
//     await displayArticlesPage(id);
//   }
//   if (hash.match(/^#\/admin\/all-stories\/(.+)$/)) {
//     const id = hash.split('/').pop().trim();
//     await displayStoryPage(id);
//   }
// };

// document.addEventListener('DOMContentLoaded', async function () {
//   await loadDataAndDisplayContent();
//   window.addEventListener('hashchange', loadDataAndDisplayContent);
//   window.addEventListener('popstate', handleNavigation);
// });

// const handleNavigation = (event) => {
//   const hash = window.location.hash;
//   if (
//     hash.match(/^#\/admin\/services\/(.+)$/) ||
//     hash.match(/^#\/admin\/employees\/(.+)$/) ||
//     hash.match(/^#\/admin\/articles\/(.+)$/) ||
//     hash.match(/^#\/admin\/all-stories\/(.+)$/)
//   ) {
//     event.preventDefault();
//     loadDataAndDisplayContent();
//   }
// };

// window.addEventListener('load', handleNavigation);
///////3

// // Добавляем слушатель события нажатия
// window.addEventListener('hashchange', () => {
//   // Получаем текущий хэш
//   const currentHash = window.location.hash;

//   // Вызываем функцию, которая обрабатывает текущий хэш
//   handleHashChange(currentHash);
//   updateContent(currentHash);
// });

// // Функция обработки изменения хэша
// function handleHashChange(hash) {
//   // Убеждаемся, что у нас есть правильный формат хэша
//   if (hash && hash.match(/^#\/admin\/services\/\d+$/)) {
//     // Получаем id из хэша (например, #/admin/articles/123)
//     const id = hash.split('/').pop();

//     // Вызываем функцию для отображения страницы статьи
//     displayArticlesPage(id);
//   } else {
//     // Если хэш не соответствует ожидаемому формату, отображаем другую страницу
//     displayDefaultPage();
//   }
// }

// // Функция отображения страницы по умолчанию
// function displayDefaultPage() {
//   // Ваша логика отображения страницы по умолчанию
//   // Например, отображение списка всех статей
//   getDataFromServices().then((data) => {
//     displayServicesInHTML(data);
//   });
// }

// // Вызываем функцию обработки изменения хэша при загрузке страницы
// document.addEventListener('DOMContentLoaded', () => {
//   handleHashChange(window.location.hash);
// });

$(document).ready(function () {
  $('.select2bs4').select2({
    theme: 'bootstrap4',
  });
});
$(document).ready(function () {
  $('.js-example-basic-multiple').select2();
});
$(document).ready(function () {
  $('.select2').select2();
});
$(() => {
  $('.js-example-basic-multiple').select2();
});
