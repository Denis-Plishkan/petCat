import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from './firebase-Config';

const displayDataInHTML = (data) => {
  const cardElements = document.querySelectorAll('.popular-services__card');

  cardElements.forEach((cardElement, index) => {
    const cardTitle = cardElement.querySelector(
      '.popular-services__card-title'
    );
    const cardDescription = cardElement.querySelector('p');

    if (data[index]) {
      cardTitle.textContent = data[index].title;
      cardDescription.textContent = data[index].description;
    }
  });
};

const getDataFromFirestore = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'services'));
    const dataArray = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dataArray.push(data);
      console.log(
        `ID документа: ${doc.id}, Название: ${data.title}, Описание: ${data.description}`
      );
    });

    //спросить за порядок показа и как лучше
    // const temp = dataArray[0];
    // dataArray[0] = dataArray[1];
    // dataArray[1] = temp;
    // dataArray.reverse();

    displayDataInHTML(dataArray);
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
  }
};

getDataFromFirestore();
