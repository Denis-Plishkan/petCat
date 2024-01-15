import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  db,
  collection,
  addDoc,
  storage,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
} from '../firebase-config';

const limitTextLength = (element, maxLength) => {
  const text = element.innerText || element.value;
  if (text.length > maxLength) {
    element.innerText = text.substring(0, maxLength);
    element.value = text.substring(0, maxLength);
  }
};

export const createStoryCard = (id, title, date, imageUrl) => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('patient-card');
  cardElement.setAttribute('data-id', id);

  const cardPhoto = document.createElement('div');
  cardPhoto.classList.add('patient-card__photo');
  const photoImg = document.createElement('img');
  photoImg.src = imageUrl;
  photoImg.alt = 'photo';
  cardPhoto.appendChild(photoImg);

  const cardTitle = document.createElement('h5');
  cardTitle.classList.add('patient-card__disease');
  cardTitle.textContent = title;

  const dateParagraph = document.createElement('p');
  dateParagraph.classList.add('patient-card__data');
  dateParagraph.textContent = date;

  cardElement.appendChild(cardPhoto);
  cardElement.appendChild(cardTitle);
  cardElement.appendChild(dateParagraph);

  return cardElement;
};

export const displayStoriesInHTML = (data) => {
  const storyBody = document.getElementById('history-body');

  if (storyBody) {
    storyBody.innerHTML = '';

    for (let i = 0; i < data.length; i += 3) {
      const line = document.createElement('div');
      line.classList.add('story-line');

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('history__wrapper-top');

      for (let j = i; j < i + 3 && j < data.length; j++) {
        const card = createStoryCard(
          data[j].id,
          data[j].title,
          data[j].date,
          data[j].img.default
        );

        card.addEventListener('click', () => {
          navigateToStory(data[j].id);
        });
        cardWrapper.appendChild(card);
      }

      line.appendChild(cardWrapper);
      storyBody.appendChild(line);
    }
  } else {
    console.error('Element with id "services-body" not found.');
  }
};

const navigateToStory = (id) => {
  window.location.hash = `#/admin/all-stories/${id}`;
};

export const getDataFromStories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'story'));
    const dataArray = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      dataArray.push(Object.assign({}, data, { id: doc.id }));
    });
    console.log('Данные', dataArray);

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
    }

    const reservationDate =
      reservationDateInput && reservationDateInput.value
        ? new Date(reservationDateInput.value).toISOString()
        : null;

    const docRef = await addDoc(collection(db, 'story'), {
      img: {
        default: imageUrl,
        webP: '',
      },
      title: titleInput.value,
      date: reservationDate,
    });

    imgForStoryInput.value = '';
    titleInput.value = '';
    reservationDateInput.value = '';

    alert('Карта истории успешно создана');
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

export const displayStoryPage = async (id) => {
  try {
    const storyData = await getStoryDetails(id);

    if (storyData) {
      console.log('История пациента:', storyData);
      const contentElement = document.getElementById('app');

      contentElement.innerHTML = `
        <div class="content">
          <div class="employees-details">
            <h2 class="popular-services__wrapper-title">
              <span contenteditable="true" id="storyTitle">${storyData.title}</span>
            </h2>
            <div class="popular-services__wrapper-subtitle">
              <h3>Когда произошло:</h3>
              <p contenteditable="true" id="storyDate">${storyData.date}</p>
            </div>
            <div  class="ava flex mt-3">
            <h2 data-v-fee137ad="">
            Фотография питомца:
            </h2>
            <div data-v-fee137ad="" class="img">
            <img data-v-fee137ad="" src="${storyData.img.default}" alt="">
            </div>
            <div data-v-fee137ad="" class="add">
            <label data-v-fee137ad="" for="img-top">Загрузить новое фото:</label>
            <input data-v-fee137ad="" class="img-top-input" id="img-top" type="file" accept="image/* ">
            </div>
            </div>
           
            <div data-v-fee137ad="" class="block-btn mt-5"> 
            <button type="button" id="updateStoryBtn" class="btn btn-block btn-success ">Сохранить изменения</button>
            <button type="button" id="deleteStoryBtn" class="btn btn-block btn-danger "style="width: 30%;" >Удалить историю</button>
            </div>
          </div>       
        </div>
        <div id="errorText" class="text-danger mt-2"></div>
        <div id="messageBox" class="message-box"></div>
      `;

      const storyTitleElement = document.getElementById('storyTitle');
      const storyDateElement = document.getElementById('storyDate');

      storyTitleElement.addEventListener('input', () => {
        limitTextLength(storyTitleElement, 70);
      });

      storyDateElement.addEventListener('input', () => {
        limitTextLength(storyDateElement, 10);
      });

      const updateStoryBtn = document.getElementById('updateStoryBtn');
      updateStoryBtn.addEventListener('click', async () => {
        const updatedFullName = document.getElementById('storyTitle').innerText;
        const updatedPosition = document.getElementById('storyDate').innerText;

        const fileInput = document.getElementById('img-top');
        const file = fileInput.files[0];

        let img = storyData.img || {};

        if (file) {
          const storageRef = ref(storage, file.name);
          await uploadBytes(storageRef, file);
          img.default = await getDownloadURL(storageRef);
        }

        await updateStoryData(id, updatedFullName, updatedPosition, {
          img,
        });
        window.location.reload();
      });

      const deleteStoryBtn = document.getElementById('deleteStoryBtn');
      deleteStoryBtn.addEventListener('click', async () => {
        try {
          const confirmation = confirm(
            'Вы уверены, что хотите удалить эту историю ?'
          );
          if (!confirmation) {
            return;
          }

          await deleteStoryData(id);

          window.location.hash = '#/admin/all-stories';
        } catch (error) {
          console.error('Ошибка при удалении данных из Firestore: ', error);
        }
      });
    }
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
  }
};

export const updateStoryData = async (
  id,
  updatedTitle,
  updatedDate,
  updatedImg
) => {
  try {
    const storyRef = doc(collection(db, 'story'), id);

    const updateData = {
      title: updatedTitle,
      date: updatedDate,

      img: updatedImg.img,
    };

    await setDoc(storyRef, updateData, { merge: true });

    showMessage('Данные успешно обновлены');

    console.log('Данные успешно обновлены.');
  } catch (error) {
    console.error('Ошибка при обновлении данных в Firestore: ', error);
  }
};

export const deleteStoryData = async (id) => {
  try {
    const storyRef = doc(collection(db, 'story'), id);
    await deleteDoc(storyRef);

    showMessage('Данные успешно удалены');

    console.log('Данные успешно удалены.');
  } catch (error) {
    console.error('Ошибка при удалении данных в Firestore: ', error);
  }
};

const getStoryDetails = async (id) => {
  try {
    const storyCollectionRef = collection(db, 'story');
    const storyDocRef = doc(storyCollectionRef, id);

    const storySnapshot = await getDoc(storyDocRef);

    if (storySnapshot.exists()) {
      return storySnapshot.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
    return null;
  }
};
const showMessage = (message) => {
  const messageBox = document.getElementById('messageBox');
  if (messageBox) {
    messageBox.textContent = message;

    setTimeout(() => {
      messageBox.textContent = '';
    }, 3000);
  }
};
