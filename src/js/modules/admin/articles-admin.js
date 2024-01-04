import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  db,
  collection,
  addDoc,
  setDoc,
  storage,
  getDocs,
  getDoc,
  doc,
} from '../firebase-Config';

export const createArticlesCard = (imageUrl, title, date, text) => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('patient-card');

  const photoWrapper = document.createElement('div');
  photoWrapper.classList.add('patient-card__photo');

  const photo = document.createElement('img');
  photo.src = imageUrl;
  photo.alt = 'photo';
  photoWrapper.appendChild(photo);

  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('patient-card__disease');
  cardTitle.textContent = title;

  //   const cardText = document.createElement('p');
  //   cardText.classList.add('patient-card__text');
  //   cardText.textContent = text;

  const dateParagraph = document.createElement('p');
  dateParagraph.classList.add('patient-card__data');
  dateParagraph.textContent = date;

  cardElement.appendChild(photoWrapper);
  cardElement.appendChild(cardTitle);
  //   cardElement.appendChild(cardText);
  cardElement.appendChild(dateParagraph);

  return cardElement;
};

export const displayArticlesInHTML = (data) => {
  const articlesBody = document.getElementById('articles-body');

  if (!articlesBody) {
    console.error('Элемент articles-body не найден!');
    return;
  }

  articlesBody.innerHTML = '';

  if (data) {
    data.forEach((articles) => {
      const card = createArticlesCard(
        articles.imageUrl,
        articles.title,
        // articles.text,
        articles.date
      );
      articlesBody.appendChild(card);
    });
  } else {
    console.error('Данные для отображения не определены');
  }
};
export const getDataFromArticles = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'articles'));
    const dataArray = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dataArray.push(data);
    });

    return dataArray;
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
    return [];
  }
};
const submitArticlesBtnHandler = async () => {
  const titleInput = document.getElementById('title');
  const imgForArticlesInput = document.getElementById('img-for-articles');
  const reservationDateInput = document.getElementById('reservationdate');
  const errorText = document.getElementById('errorText');

  errorText.textContent = '';

  if (!imgForArticlesInput.files || !titleInput.value) {
    errorText.textContent =
      'Ошибка: Поля "История" и "Фотография для статьи" обязательны для заполнения.';
    return;
  }

  const file = imgForArticlesInput.files[0];

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

    const docRef = await addDoc(collection(db, 'articles'), {
      imageUrl: imageUrl,
      title: titleInput.value,

      date: reservationDate,
    });

    imgForArticlesInput.value = '';
    titleInput.value = '';
    reservationDateInput.value = '';
  } catch (error) {
    console.error('Ошибка: ', error.message, error.code);
  }
};

export const initializeArticlesForm = () => {
  const submitArticlesBtn = document.getElementById('submitArticlesBtn');

  if (submitArticlesBtn) {
    submitArticlesBtn.addEventListener('click', submitArticlesBtnHandler);
  }
};
