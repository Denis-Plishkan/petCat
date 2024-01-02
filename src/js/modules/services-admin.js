import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  db,
  collection,
  addDoc,
  setDoc,
  storage,
  getDocs,
  doc,
} from './firebase-Config';

const createCard = (id, title, description) => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('popular-services__card');
  cardElement.setAttribute('data-id', id);

  const cardTitle = document.createElement('h4');
  cardTitle.classList.add('popular-services__card-title');
  cardTitle.textContent = title;

  const cardDescription = document.createElement('p');
  cardDescription.textContent = description;

  cardElement.appendChild(cardTitle);
  cardElement.appendChild(cardDescription);

  return cardElement;
};

export const displayServicesInHTML = (data) => {
  const servicesBody = document.getElementById('services-body');

  if (servicesBody) {
    servicesBody.innerHTML = '';

    for (let i = 0; i < data.length; i += 3) {
      const line = document.createElement('div');
      line.classList.add('services-line');

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('popular-services__card-wrapper');

      for (let j = i; j < i + 3 && j < data.length; j++) {
        const card = createCard(data[j].id, data[j].title, data[j].description);
        card.addEventListener('click', () => {
          navigateToService(card.getAttribute('data-id'));
        });
        cardWrapper.appendChild(card);
      }

      line.appendChild(cardWrapper);
      servicesBody.appendChild(line);
    }
  } else {
    console.error('Element with id "services-body" not found.');
  }
};

export const getDataFromServices = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'services'));
    const dataArray = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dataArray.push(data);
    });
    console.log('Данные', dataArray);
    return dataArray;
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
    return [];
  }
};

const navigateToService = (serviceId) => {
  window.location.hash = `#/admin/services/${serviceId}`;
};

const submitServiceBtnHandler = async function () {
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
    }

    const docRef = await addDoc(collection(db, 'services'), {
      title: titleInput.value,
      description: descriptionInput.value,
      imageUrl: imageUrl,
    });

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

export const initializeServiceForm = () => {
  const submitServiceBtn = document.getElementById('submitServiceBtn');

  if (submitServiceBtn) {
    submitServiceBtn.addEventListener('click', submitServiceBtnHandler);
  }
};
