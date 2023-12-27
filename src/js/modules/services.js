import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from './firebase-Config';

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

const displayDataInHTML = (data) => {
  const swiperWrapper = document.getElementById('swiperWrapper');
  swiperWrapper.innerHTML = '';

  for (let i = 0; i < data.length; i += 3) {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('popular-services__card-wrapper');

    for (let j = i; j < i + 3 && j < data.length; j++) {
      const card = createCard(data[j].title, data[j].description);
      cardWrapper.appendChild(card);
    }

    slide.appendChild(cardWrapper);
    swiperWrapper.appendChild(slide);
  }
};

const getDataFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'services'));
    const dataArray = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dataArray.push(data);
      console.log(
        `ID документа: ${doc.id}, Название: ${data.title}, Описание: ${data.description}, URL изображения: ${data.imageUrl}`
      );
    });

    displayDataInHTML(dataArray);
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
  }
};

getDataFromFirestore();
