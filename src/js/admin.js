import {
  auth,
  db,
  collection,
  addDoc,
  setDoc,
  storage,
  getDocs,
  getDoc,
} from './modules/firebase-config';

import {
  displayServicesInHTML,
  getDataFromServices,
  initializeServiceForm,
  displayServicePage,
  getServiceDetails,
} from './modules/admin/services-admin';

import {
  displayStoriesInHTML,
  getDataFromStories,
  initializeStoryForm,
  displayStoryPage,
} from './modules/admin/stories-admin';

import {
  displayEmployeInHTML,
  getDataFromEmployees,
  initializeEmployeesForm,
  displayEmployeesPage,
} from './modules/admin/employees-admin';

import {
  displayArticlesInHTML,
  getDataFromArticles,
  initializeArticlesForm,
  displayArticlesPage,
  getArticlesDetails,
} from './modules/admin/articles-admin';

import {
  initializeContactsForm,
  displayContactPage,
} from './modules/admin/contacts-admin';

import { onAuthStateChanged } from './auth';
import * as ContentModule from './modules/admin/content-admin';

document.addEventListener('DOMContentLoaded', async function () {
  onAuthStateChanged(auth, user);
  let userCounter = 0;

  await ContentModule.updateContentPage();

  window.addEventListener('load', HashChangeModule.handleHashChange);
  window.addEventListener('hashchange', HashChangeModule.handleHashChange);
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
