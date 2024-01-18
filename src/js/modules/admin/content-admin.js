import {
  db,
  collection,
  addDoc,
  setDoc,
  storage,
  getDocs,
  getDoc,
} from '../firebase-config';

import {
  displayServicesInHTML,
  getDataFromServices,
  initializeServiceForm,
  displayServicePage,
  getServiceDetails,
} from './services-admin';

import {
  displayStoriesInHTML,
  getDataFromStories,
  initializeStoryForm,
  displayStoryPage,
} from './stories-admin';

import {
  displayEmployeInHTML,
  getDataFromEmployees,
  initializeEmployeesForm,
  displayEmployeesPage,
} from './employees-admin';

import { addDiplomaField, removeField } from './education-form.js';

import {
  displayArticlesInHTML,
  getDataFromArticles,
  initializeArticlesForm,
  displayArticlesPage,
  getArticlesDetails,
} from './articles-admin';

import { initializeContactsForm, displayContactPage } from './contacts-admin';

// import { usersCount } from './user-counter';

// export async function usersCount() {
//   const usersCollection = collection(db, 'users');

//   try {
//     const querySnapshot = await getDocs(usersCollection);
//     return querySnapshot.size;
//   } catch (error) {
//     console.error('Error counting users:', error);
//     return -1; // Возвращайте значение по умолчанию или обработайте ошибку по вашему усмотрению
//   }
// }

export async function updateContent() {
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
      content = getCreateServiceForm();
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
      <img
        id="img-preview"
        style="width: 100%; height: 100%;"
      />
    </div>
            <div class="mt-3">
              <label for="title">Что случилось</label
              ><input
                id="title"
                type="text"
                placeholder="История"
                style="width: 50%"
                maxlength="300"
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
                  maxlength="10"
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
                  <label for="full_name">Полное имя</label>
                  <input id="full_name" type="text" placeholder="Полное имя" style="width: 50%" maxlength="300" />
                </div>
      
                <div class="mt-3">
                  <label>Фотография для личной страницы</label>
                  <div class="add">
                    <input data-v-e29172df="" class="img-top-input" id="img-for-page" type="file" accept="image/* " />
                    <label for="previewImage">Предварительный просмотр:</label>
                    <img id="previewImage" style="max-width: 100%; max-height: 200px;" />
                  </div>
                </div>
         
      
                <div class="mt-3">
                  <label for="position">Должность</label>
                  <input id="position" type="text" placeholder="Должность" style="width: 50%" maxlength="300" />
                </div>
      
                <div class="mt-3">
                  <label for="specializations">Специализации</label>
                  <select id="specializations" multiple style="width: 50%"></select>
                </div>
      
                <div class="mt-3">
                <label for="education">Дипломы: </label>
                <div class="diploma-container education-container">
                  <div class="mt-3">
                    <label for="education">Год окончания: </label>
                    <input class="diploma-year-input" type="text" placeholder="Год окончания" style="width: 10%" />
                    <label for="diplomaPlace">Место окончания: </label>
                    <input class="diploma-place-input" type="text" placeholder="информация" style="width: 50%" />
                    <button id="addDiplomaBtn">Добавить пункт</button>
                  </div>
                </div>
              </div>
              
              <div class="mt-3">
                <label for="education">Дополнительное обучение: </label>
                <div class="others-container education-container">
                  <div class="mt-3">
                    <label for="education">Год окончания: </label>
                    <input class="others-year-input" type="text" placeholder="Год окончания" style="width: 10%" />
                    <label for="othersPlace">Место окончания: </label>
                    <input class="others-place-input" type="text" placeholder="информация" style="width: 50%" />
                    <button id="addOthersBtn">Добавить пункт</button>
                  </div>
                </div>
              </div>
              
                <div class="mt-3">
                  <label for="skills">Профессиональные навыки</label>
                  <input id="skills" type="text" placeholder="Проф. навыки" style="width: 50%" />
                </div>
              </div>
      
              <div class="mt-5">
                <button data-form-type="employees" id="submitEmployeesBtn" type="button" class="btn btn-block btn-success btn-lg">
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
                  maxlength="500"
                />
              </div>
              <div class="mt-3">
              <label for="reservationdate">Дата</label>
              <input
              id="reservationdate"
              type="date"
              style="width: 50%"
       
              min="1000-01-01" 
              max="9999-12-31"  
            />
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
      // await usersCount();
      // <h3>${userCounter}</h3>

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
}

export function getCreateServiceForm() {
  return `

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
              maxlength="500"
         
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
              maxlength="500"
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
              maxlength="5000"
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
}

export async function updateContentPage() {
  const hash = window.location.hash;

  initializeServiceForm();
  initializeEmployeesForm();
  initializeStoryForm();
  initializeContactsForm();
  initializeArticlesForm();

  if (hash.match(/^#\/admin\/services\/(.+)$/)) {
    const id = hash.split('/').pop().trim();
    await displayServicePage(id);
    return;
  }

  if (hash.match(/^#\/admin\/employees\/(.+)$/)) {
    const id = hash.split('/').pop().trim();
    await displayEmployeesPage(id);
    return;
  }

  if (hash.match(/^#\/admin\/articles\/(.+)$/)) {
    const id = hash.split('/').pop().trim();
    await displayArticlesPage(id);
    return;
  }

  if (hash.match(/^#\/admin\/all-stories\/(.+)$/)) {
    const id = hash.split('/').pop().trim();
    await displayStoryPage(id);
    return;
  }

  await updateContent();
}
