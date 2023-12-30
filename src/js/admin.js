// import { auth, onAuthStateChanged } from './modules/firebase-Config';
// import { collection, getDocs } from 'firebase/firestore/lite';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  auth,
  db,
  collection,
  addDoc,
  storage,
  getDocs,
  onAuthStateChanged,
} from './modules/firebase-Config';
import { verifyIdToken, getClaims } from 'firebase/auth';
import {
  getDataFromFirestore,
  createCard,
  createService,
  uploadImage,
  getDataFromServices,
  displayServicesInHTML,
} from './modules/services-admin';

onAuthStateChanged(auth, async function (user) {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    const userQuery = collection(db, 'users');
    const userSnapshot = await getDocs(userQuery);
    const existingUser = userSnapshot.docs.find(
      (doc) => doc.data().uid === user.uid
    );

    if (existingUser) {
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
    } else {
    }
  }
});

document.addEventListener('DOMContentLoaded', async function () {
  let userCounter = 0;

  async function usersCount() {
    const usersCollection = collection(db, 'users');

    try {
      const querySnapshot = await getDocs(usersCollection);
      const userCount = querySnapshot.size;
      userCounter = userCount;
      console.log(`Количество пользователей: ${userCount}`);
      console.log(typeof userCount);
      return userCount;
    } catch (error) {
      console.error('Ошибка при получении количества пользователей:', error);
      return '?';
    }
  }

  const updateContent = async () => {
    // submitBtn.addEventListener('click', async function () {
    let hash = window.location.hash;

    let content = '';
    console.log('Hash:', window.location.hash);
    switch (hash) {
      case '#/admin/services':
        content = `
        <div class="content">
        <h2 class="popular-services__wrapper-title">
        Список всех услуг на данный момент
      </h2>
        <div class="services-wrapper" id="services-body"></div>
        </div>
        `;
        getDataFromServices();
        break;

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
      <div class="history"> 
      <div class="history__cards" id="history-body">
      </div>
        </div>
        </div>
        `;
        getDataFromStories();
        break;

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
    const contentContainer = document.getElementById('dynamicContentContainer');

    const submitServiceBtnHandler = async function () {
      console.log('Кнопка нажата!');
      const titleInput = document.getElementById('title');
      const descriptionInput = document.getElementById('desctiption');
      const fileInput = document.getElementById('img-for-page');
      const textInput = document.getElementById('text');
      const errorText = document.getElementById('errorText');

      errorText.textContent = '';

      if (!titleInput.value || !descriptionInput.value) {
        errorText.textContent =
          'Ошибка: Поля "Название" и "Описание" обязательны для заполнения.';
        return;
      }

      const file = fileInput.files[0];

      try {
        let imageUrl = '';

        if (file) {
          const storageRef = ref(storage, file.name);
          await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(storageRef);
          console.log('URL фотографии:', imageUrl);
        }

        const docRef = await addDoc(collection(db, 'services'), {
          title: titleInput.value,
          description: descriptionInput.value,
          imageUrl: imageUrl,
        });

        console.log('Документ успешно добавлен с ID: ', docRef.id);

        titleInput.value = '';
        descriptionInput.value = '';
        if (fileInput) {
          fileInput.value = '';
        }
        textInput.value = '';
      } catch (error) {
        console.error('Ошибка: ', error.message, error.code);
      }
    };

    const submitServiceBtn = document.getElementById('submitServiceBtn');

    if (submitServiceBtn) {
      submitServiceBtn.removeEventListener('click', submitServiceBtnHandler);
      submitServiceBtn.addEventListener('click', submitServiceBtnHandler);
    }

    const submitStoryBtnHandler = async () => {
      console.log('Кнопка нажата!');
      const titleInput = document.getElementById('title');
      const imgForStoryInput = document.getElementById('img-for-story');
      const reservationDateInput = document.getElementById('reservationdate');
      const errorText = document.getElementById('errorText');

      errorText.textContent = '';

      if (!imgForStoryInput.files || !titleInput.value) {
        errorText.textContent =
          'Ошибка: Поля "История" и "Фотография для истории" обязательны для заполнения.';
        return;
      }

      const file = imgForStoryInput.files[0];

      if (errorText) {
        errorText.textContent = '';
      } else {
        console.error('Элемент errorText не найден!');
      }

      try {
        let imageUrl = '';

        if (file) {
          const storageRef = ref(storage, file.name);
          await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(storageRef);
          console.log('URL фотографии:', imageUrl);
        }

        const reservationDate =
          reservationDateInput && reservationDateInput.value
            ? new Date(reservationDateInput.value).toISOString()
            : null;

        const docRef = await addDoc(collection(db, 'story'), {
          imageUrl: imageUrl,
          title: titleInput.value,
          date: reservationDate,
        });

        console.log('Документ успешно добавлен с ID: ', docRef.id);

        imgForStoryInput.value = '';
        titleInput.value = '';
        reservationDateInput.value = '';
      } catch (error) {
        console.error('Ошибка: ', error.message, error.code);
      }
    };
    const submitStoryBtn = document.getElementById('submitStoryBtn');

    if (submitStoryBtn) {
      submitStoryBtn.removeEventListener('click', submitStoryBtnHandler);
      submitStoryBtn.addEventListener('click', submitStoryBtnHandler);
    }

    if (contentContainer) {
      contentContainer.innerHTML = content;
      document.addEventListener('click', (event) => {
        const target = event.target;

        if (target.id === 'submitServiceBtn') {
          submitServiceBtnHandler();
        } else if (target.id === 'submitStoryBtn') {
          submitStoryBtnHandler();
        }
      });
    } else {
      console.error('Контейнер для контента не найден!');
    }
  };

  window.addEventListener('load', updateContent);
  window.addEventListener('hashchange', updateContent);

  const createCard = (title, description) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('popular-services__card');

    const cardTitle = document.createElement('h4');
    cardTitle.classList.add('popular-services__card-title');
    cardTitle.textContent = title;

    const cardDescription = document.createElement('p');
    cardDescription.textContent = description;

    cardElement.appendChild(cardTitle);
    cardElement.appendChild(cardDescription);

    return cardElement;
  };

  const displayServicesInHTML = (data) => {
    const servicesBody = document.getElementById('services-body');

    servicesBody.innerHTML = '';

    for (let i = 0; i < data.length; i += 3) {
      const line = document.createElement('div');
      line.classList.add('services-line');

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('popular-services__card-wrapper');

      for (let j = i; j < i + 3 && j < data.length; j++) {
        const card = createCard(data[j].title, data[j].description);
        cardWrapper.appendChild(card);
      }

      line.appendChild(cardWrapper);
      servicesBody.appendChild(line);
    }
  };

  const getDataFromServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const dataArray = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        dataArray.push(data);
        // console.log(
        //   `ID документа: ${doc.id}, Название: ${data.title}, Описание: ${data.description}, URL изображения: ${data.imageUrl}`
        // );
      });

      displayServicesInHTML(dataArray);
    } catch (error) {
      console.error('Ошибка при получении данных из Firestore: ', error);
    }
  };

  const createStoryCard = (imageUrl, title, date) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('patient-card');

    const photoContainer = document.createElement('div');
    photoContainer.classList.add('patient-card__photo');
    const photo = document.createElement('img');
    photo.src = imageUrl || 'placeholder_image_url.jpg';
    photo.alt = 'photo';
    photoContainer.appendChild(photo);

    const diseaseTitle = document.createElement('h5');
    diseaseTitle.classList.add('patient-card__disease');
    diseaseTitle.textContent = title;

    const dateElement = document.createElement('p');
    dateElement.textContent = `Дата: ${date || 'Не указана'}`;

    cardElement.appendChild(photoContainer);
    cardElement.appendChild(diseaseTitle);
    cardElement.appendChild(dateElement);

    return cardElement;
  };

  const displayStoriesInHTML = (data) => {
    const historyBody = document.getElementById('history-body');

    historyBody.innerHTML = '';

    for (const story of data) {
      const card = createStoryCard(story.imageUrl, story.title, story.date);
      historyBody.appendChild(card);
    }
  };

  const getDataFromStories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'story'));
      const dataArray = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        dataArray.push(data);
      });

      displayStoriesInHTML(dataArray);
    } catch (error) {
      console.error(
        'Ошибка при получении данных из Firestore для историй: ',
        error
      );
    }
  };
});

////истории
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { db, collection, addDoc, storage } from './modules/firebase-Config';

// document
//   .getElementById('submitBtn')
//   .addEventListener('click', async function () {
//     const titleInput = document.getElementById('title');
//     const descriptionInput = document.getElementById('desctiption');
//     const errorText = document.getElementById('errorText');

//     errorText.textContent = '';

//     if (!titleInput.value || !descriptionInput.value) {
//       errorText.textContent =
//         'Ошибка: Поля "Фотография" и "Историия" обязательны для заполнения.';
//       return;
//     }

//     const fileInput = document.getElementById('img-for-story');
//     const file = fileInput.files[0];

//     try {
//       let imageUrl = '';

//       if (file) {
//         const storageRef = ref(storage, file.name);
//         await uploadBytes(storageRef, file);
//         imageUrl = await getDownloadURL(storageRef);
//         console.log('URL фотографии:', imageUrl);
//       }

//       const docRef = await addDoc(collection(db, 'story'), {
//         title: titleInput.value,
//         description: descriptionInput.value,
//         imageUrl: imageUrl,
//       });

//       console.log('Документ успешно добавлен с ID: ', docRef.id);

//       titleInput.value = '';
//       descriptionInput.value = '';

//       document.getElementById('submitBtn').setAttribute('disabled', 'true');
//     } catch (error) {
//       console.error('Ошибка: ', error.message, error.code);
//     }
//   });

////////
