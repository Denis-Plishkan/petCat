import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  db,
  collection,
  addDoc,
  setDoc,
  storage,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
} from '../firebase-config';

const createCard = (id, title) => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('popular-services__card');
  cardElement.setAttribute('data-id', id);

  const cardTitle = document.createElement('h4');
  cardTitle.classList.add('popular-services__card-title');
  cardTitle.textContent = title;

  cardElement.appendChild(cardTitle);

  return cardElement;
};

const navigateToPosition = (id) => {
  window.location.hash = `#/admin/position/${id}`;
};

export const displayPositionInHTML = (data) => {
  const positionBody = document.getElementById('position-body');

  if (positionBody) {
    positionBody.innerHTML = '';

    for (let i = 0; i < data.length; i += 3) {
      const line = document.createElement('div');
      line.classList.add('services-line');

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('popular-services__card-wrapper');

      for (let j = i; j < i + 3 && j < data.length; j++) {
        const card = createCard(data[j].id, data[j].title, data[j].description);

        card.addEventListener('click', () => {
          navigateToPosition(data[j].id);
        });
        cardWrapper.appendChild(card);
      }

      line.appendChild(cardWrapper);
      positionBody.appendChild(line);
    }
  } else {
    console.error('Element with id "position-body" not found.');
  }
};

export const getDataFromPosition = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'position'));
    const dataArray = [];

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();

      dataArray.push(Object.assign({}, data, { id: doc.id }));
    });

    displayPositionInHTML(dataArray);
    console.log('Данные', dataArray);

    return dataArray;
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
    return [];
  }
};

const submitPositionBtnHandler = async function () {
  console.log('Button clicked');
  const titleInput = document.getElementById('title');

  if (!titleInput.value) {
    errorText.textContent =
      'Ошибка: Поле "Название" обязательно для заполнения.';
    return;
  }

  try {
    const docRef = await addDoc(collection(db, 'position'), {
      title: titleInput.value,
    });

    titleInput.value = '';

    alert('Должность успешно добавлена');
  } catch (error) {
    console.error('Ошибка: ', error.message, error.code);
  }
};

export const initializePositionForm = () => {
  // console.log('Initializing position form...');
  const submitPositionBtn = document.getElementById('submitPositionBtn');
  // console.log('Submit button:', submitPositionBtn);

  if (submitPositionBtn) {
    submitPositionBtn.addEventListener(
      'click',
      submitPositionBtnHandler.bind(this)
    );
    console.log('Event listener added for submit button.');
  }
};
export const getPositionList = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'position'));
    const positionArray = [];

    querySnapshot.forEach((doc) => {
      positionArray.push(doc.data().title);
    });

    return positionArray;
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
    return [];
  }
};
export const updatePositionList = async () => {
  const positionSelect = document.getElementById('position');
  if (positionSelect) {
    const positions = await getPositionList();

    positionSelect.innerHTML = '';

    positions.forEach((position) => {
      const option = document.createElement('option');
      option.value = position;
      option.text = position;
      positionSelect.add(option);
    });
  }
};
