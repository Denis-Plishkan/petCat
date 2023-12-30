import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  auth,
  db,
  collection,
  addDoc,
  storage,
  getDocs,
} from './firebase-Config';

export const getDataFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'services'));
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

export const createCard = (title, description) => {
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

export const createService = async (title, description, imageUrl) => {
  try {
    const docRef = await addDoc(collection(db, 'services'), {
      title: title,
      description: description,
      imageUrl: imageUrl,
    });

    console.log('Документ успешно добавлен с ID: ', docRef.id);
  } catch (error) {
    console.error('Ошибка: ', error.message, error.code);
    throw error;
  }
};

export const uploadImage = async (file) => {
  try {
    const storageRef = ref(storage, file.name);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    console.log('URL фотографии:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error(
      'Ошибка при загрузке изображения: ',
      error.message,
      error.code
    );
    throw error;
  }
};

export const displayServicesInHTML = (data) => {
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

export const getDataFromServices = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'services'));
    const dataArray = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dataArray.push(data);
    });

    displayServicesInHTML(dataArray);
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
  }
};
