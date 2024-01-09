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
} from './modules/firebase-Config';

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

document.addEventListener('DOMContentLoaded', async function () {
  let userCounter = 0;

  async function usersCount() {
    const usersCollection = collection(db, 'users');

    try {
      const querySnapshot = await getDocs(usersCollection);
      userCounter = querySnapshot.size;

      return;
    } catch (error) {
      return '?';
    }
  }

  const updateContent = async () => {
    let hash = window.location.hash;
    let id;
    let content = '';

    switch (hash) {
      case '#/admin/services':
        content = `
        <div class="content">
        <h2 class="popular-services__wrapper-title">
        Список всех услуг на данный момент
      </h2>
      <div class="services-wrapper" id="services-body">
      </div>
      </div>
        `;
        getDataFromServices().then((servicesData) => {
          displayServicesInHTML(servicesData);
        });
        break;

      case /^#\/admin\/services\/(.+)$/: {
        id = hash.split('/').pop().trim();
        console.log('Страница:', id);
        displayServicePage(id);
        break;
      }

      case '#/admin/services/services-str':
        content = `
          <div class="content">
            <div class="">
              <h2>Создание услуги</h2>
              <div class="mt-5">
                <div class="mt-3">
                  <label for="title">Название услуги</label
                  ><input
                    id="title"
                    type="text"
                    placeholder="Название услуги"
                    style="width: 50%"
                  />
                </div>

                <div class="mt-3">
                  <label>Фотография для личной страницы</label>

                  <div class="add">
                    <input
                      data-v-e29172df=""
                      class="img-top-input"
                      id="img-for-page"
                      type="file"
                      accept="image/* "
                    />
                  </div>
                </div>
                <div class="mt-3">
                  <label for="desctiption">Описание</label
                  ><textarea
                    placeholder="Описание услуги"
                    id="desctiption"
                    cols="30"
                    rows="10"
                    style="width: 100%; height: 100px; resize: none"
                  ></textarea>
                </div>
                <div class="mt-3">
                  <label for="desctiption">Статья</label
                  ><textarea
                    placeholder="Текст статьи"
                    id="text"
                    cols="30"
                    rows="10"
                    style="width: 100%; height: 200px; resize: none"
                  ></textarea>
                </div>
              </div>

              <div class="mt-5">
                <button
                data-form-type="service"
                id="submitServiceBtn"
                  type="button"
                  class="btn btn-block btn-success btn-lg"
                >
                  Завершить создание услуги
                </button>

                <div id="errorText" class="text-danger mt-2"></div>
              </div>
            </div>
          </div>
        `;

        break;

      case '#/admin/all-stories':
        content = ` 
        <div class="content">
        <h2 class="popular-services__wrapper-title">
        Список всех историй пациентов
      </h2>
      <div class="history__wrapper" id="history-body">
      </div>
        </div>
        </div>
        `;

        getDataFromStories().then((storiesData) => {
          displayStoriesInHTML(storiesData);
        });
        break;

      case /^#\/admin\/all-stories\/(.+)$/: {
        id = hash.split('/').pop().trim();
        console.log('Страница:', id);
        displayStoryPage(id);
        break;
      }

      case '#/admin/all-stories/stories-str':
        content = `
        <div class="content">
        <div class="">
          <h2>Добавление истории пациента</h2>
          <div class="mt-5">
            <div class="mt-3">
              <p>Фотография для истории</p>
              <div class="add">
                <input
                  class="img-top-page"
                  id="img-for-story"
                  type="file"
                  accept="image/* "
                />
              </div>
            </div>
            <div class="mt-3">
              <label for="title">Что случилось</label
              ><input
                id="title"
                type="text"
                placeholder="История"
                style="width: 50%"
              />
            </div>
            <div class="form-group">
              <label>Когда произошло:</label>
              <div
                class="input-group date"
                id="reservationdate"
                data-target-input="nearest"
              >
                <input
                  type="text"
                  class="form-control datetimepicker-input"
                  data-target="#reservationdate"
                />
                <div
                  class="input-group-append"
                  data-target="#reservationdate"
                  data-toggle="datetimepicker"
                >
                  <div class="input-group-text">
                  <i class="fa fa-calendar"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5">
            <button
            data-form-type="story"
            id="submitStoryBtn"
              type="button"
              class="btn btn-block btn-success btn-lg"
            >
              Завершить создание итории пациента
            </button>

            <div id="errorText" class="text-danger mt-2"></div>
          </div>
        </div>
      </div> 
      `;
        break;

      case '#/admin/employees':
        content = `
              <div class="content">
              <h2 class="popular-services__wrapper-title">
              Список всех наших работников
            </h2>
            <div class="answers__wrapper" id="employees-body">
            </div>
              </div>
              </div>
              `;
        getDataFromEmployees().then((employeesData) => {
          displayEmployeInHTML(employeesData);
        });

        break;

      case /^#\/admin\/employees\/(.+)$/:
        id = hash.split('/').pop().trim();
        console.log('Страница:', id);
        displayEmployeesPage(id);
        break;

      case '#/admin/employees/employees-str':
        content = `
            <div class="content">
              <div class="">
                <h2>Создание карты работника</h2>
                <div class="mt-5">
                  <div class="mt-3">
                    <label for="title">Полное имя</label
                    ><input
                      id="full_name"
                      type="text"
                      placeholder="Полное имя"
                      style="width: 50%"
                    />
                  </div>
  
                  <div class="mt-3">
                    <label>Фотография для личной страницы</label>
  
                    <div class="add">
                      <input
                        data-v-e29172df=""
                        class="img-top-input"
                        id="img-for-page"
                        type="file"
                        accept="image/* "
                      />
                    </div>
                  </div>
                  <div class="mt-3">
                    <label for="title">Должность</label
                    ><input
                      id="position"
                      type="text"
                      placeholder="Должность"
                      style="width: 50%"
                    />
                  </div>
  
                  <div class="mt-3">
  <label for="specializations">Специализации</label>
  <select id="specializations"  multiple style="width: 50%" >
   
  </select>
</div>
                  <div class="mt-3">
                    <label for="title">Образование</label
                    ><input
                      id="education"
                      type="text"
                      placeholder="Образование"
                      style="width: 50%"
                    />
                  </div>
                  <div class="mt-3">
                    <label for="title">Профессиональные навыки</label
                    ><input
                      id="skills"
                      type="text"
                      placeholder="Проф. навыки"
                      style="width: 50%"
                    />
                  </div>
                </div>
  
                <div class="mt-5">
                  <button
                  data-form-type="employees"
                  id="submitEmployeesBtn"
                    type="button"
                    class="btn btn-block btn-success btn-lg"
                  >
                    Завершить создание карты работника
                  </button>
  
                  <div id="errorText" class="text-danger mt-2"></div>
                </div>
              </div>
            </div>
          `;

        break;

      case '#/admin/contacts':
        const id = 'izVX1ZrDG1gaYNHaPnAG';
        displayContactPage(id);
        break;

      case '#/admin/articles':
        content = `
                <div class="content">
                <h2 class="popular-services__wrapper-title">
                Список всех cтатей
              </h2>
              <div class="answers__wrapper" id="articles-body">
              </div>
                </div>
                </div>
                `;
        getDataFromArticles().then((articlesData) => {
          displayArticlesInHTML(articlesData);
        });

        break;

      case /^#\/admin\/articles\/(.+)$/: {
        id = hash.split('/').pop().trim();
        console.log('Страница:', id);
        displayArticlesPage(id);
        break;
      }

      case '#/admin/articles/articles-str':
        content = `
          <div class="content">
          <div class="">
            <h2>Добавление статьи </h2>
            <div class="mt-5">
              <div class="mt-3">
                <p>Фотография для статьи</p>
                <div class="add">
                  <input
                    class="img-top-page"
                    id="img-for-articles"
                    type="file"
                    accept="image/* "
                  />
                </div>
              </div>
              <div class="mt-3">
                <label for="title">Что случилось</label
                ><input
                  id="title"
                  type="text"
                  placeholder="История"
                  style="width: 50%"
                />
              </div>
              <div class="form-group">
                <label>Когда произошло:</label>
                <div
                  class="input-group date"
                  id="reservationdate"
                  data-target-input="nearest"
                >
                  <input
                  id="reservationDate"
                    type="text"
                    class="form-control datetimepicker-input"
                    data-target="#reservationdate"
                  />
                  <div
                    class="input-group-append"
                    data-target="#reservationdate"
                    data-toggle="datetimepicker"
                  >
                    <div class="input-group-text">
                    <i class="fa fa-calendar"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="mt-5">
              <button
              data-form-type="articles"
              id="submitArticlesBtn"
                type="button"
                class="btn btn-block btn-success btn-lg"
              >
                Завершить создание статьи 
              </button>
  
              <div id="errorText" class="text-danger mt-2"></div>
            </div>
          </div>
        </div> 
        `;
        break;

      default:
        await usersCount();

        content = `
          <div class="content-header" >
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-sm-6">
                  <h1 class="m-0">Статистика</h1>
                </div>
                <div class="col-sm-6">
                  <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="#">Home</a></li>
                    <li class="breadcrumb-item active">Dashboard v1</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-lg-3 col-6">
                  <div class="small-box bg-warning">
                    <div class="inner" id="totalUsers">
                      <h3>${userCounter}</h3>
                      <p>Пользователей зарегистрировано</p>
                    </div>
                    <div class="icon">
                      <i class="ion ion-person-add"></i>
                    </div>
                    <a href="#" class="small-box-footer">
                      More info <i class="fas fa-arrow-circle-right"></i>
                    </a>
                  </div>
                </div>
                <div class="col-lg-3 col-6">
                  <div class="small-box bg-danger">
                    <div class="inner">
                      <p>Оставлено отзывов</p>
                    </div>
                    <div class="icon">
                      <i class="ion ion-pie-graph"></i>
                    </div>
                    <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
                  </div>
                </div>
              </div>
              <div class="map">
                <div class="card bg-gradient-primary">
                  <div class="card-header border-0">
                    <h3 class="card-title">
                      <span class="iconify map-marker" data-icon="clarity:map-marker-line"></span>
                      Пользователи
                    </h3>
                  </div>
                  <div class="card-body">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d45522840.46497562!2d61.62450108398035!3d45.861431751010976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sua!4v1634672777981!5m2!1sru!2sua"
                      width="100%"
                      height="400px"
                      allowfullscreen=""
                      loading="lazy"
                      style="border: 0px"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </section>
        `;
        break;
    }

    const appElement = document.getElementById('app');
    appElement.innerHTML = content;
  };

  const updateContentPage = async () => {
    await updateContent();

    initializeServiceForm();
    initializeEmployeesForm();
    initializeStoryForm();
    initializeContactsForm();
    initializeArticlesForm();

    const hash = window.location.hash;
    if (hash.match(/^#\/admin\/services\/(.+)$/)) {
      const id = hash.split('/').pop().trim();
      await displayServicePage(id);
    }
    if (hash.match(/^#\/admin\/employees\/(.+)$/)) {
      const id = hash.split('/').pop().trim();
      await displayEmployeesPage(id);
    }
    if (hash.match(/^#\/admin\/articles\/(.+)$/)) {
      const id = hash.split('/').pop().trim();
      await displayArticlesPage(id);
    }
    if (hash.match(/^#\/admin\/all-stories\/(.+)$/)) {
      const id = hash.split('/').pop().trim();
      await displayStoryPage(id);
    }
  };

  window.addEventListener('load', updateContentPage);

  window.addEventListener('hashchange', updateContentPage);
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
