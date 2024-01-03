import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  auth,
  db,
  collection,
  addDoc,
  storage,
  getDocs,
} from '../firebase-Config';

export const createStoryCard = (imageUrl, title, date) => {
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

  const dateParagraph = document.createElement('p');
  dateParagraph.classList.add('patient-card__data');
  dateParagraph.textContent = date;

  cardElement.appendChild(photoWrapper);
  cardElement.appendChild(cardTitle);
  cardElement.appendChild(dateParagraph);

  return cardElement;
};

export const displayStoriesInHTML = (data) => {
  const storyBody = document.getElementById('history-body');

  if (!storyBody) {
    console.error('Элемент history-body не найден!');
    return;
  }

  storyBody.innerHTML = '';

  if (data) {
    data.forEach((story) => {
      const card = createStoryCard(story.imageUrl, story.title, story.date);
      storyBody.appendChild(card);
    });
  } else {
    console.error('Данные для отображения не определены');
  }
};

export const getDataFromStories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'story'));
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

const submitStoryBtnHandler = async () => {
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

    imgForStoryInput.value = '';
    titleInput.value = '';
    reservationDateInput.value = '';
  } catch (error) {
    console.error('Ошибка: ', error.message, error.code);
  }
};

export const initializeStoryForm = () => {
  const submitStoryBtn = document.getElementById('submitStoryBtn');

  if (submitStoryBtn) {
    submitStoryBtn.addEventListener('click', submitStoryBtnHandler);
  }
};
