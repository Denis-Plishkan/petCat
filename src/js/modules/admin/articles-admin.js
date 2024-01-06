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
} from '../firebase-Config';

export const createArticlesCard = (id, title, date, imageUrl) => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('patient-card');
  cardElement.setAttribute('data-id', id);

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

  if (articlesBody) {
    articlesBody.innerHTML = '';

    for (let i = 0; i < data.length; i += 3) {
      const line = document.createElement('div');
      line.classList.add('specialists-line');

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('specialists-card__wrapper');

      for (let j = i; j < i + 3 && j < data.length; j++) {
        const card = createArticlesCard(
          data[j].id,
          data[j].title,
          data[j].date,
          data[j].img.default
        );

        card.addEventListener('click', () => {
          navigateToArticles(data[j].id);
        });
        cardWrapper.appendChild(card);
      }

      line.appendChild(cardWrapper);
      articlesBody.appendChild(line);
    }
  }
};
export const getDataFromArticles = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'articles'));
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

const navigateToArticles = (id) => {
  window.location.hash = `#/admin/articles/${id}`;
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
    }

    const reservationDate =
      reservationDateInput && reservationDateInput.value
        ? new Date(reservationDateInput.value).toISOString()
        : null;

    const docRef = await addDoc(collection(db, 'articles'), {
      img: {
        default: imageUrl,
        webP: '',
      },
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

export const displayArticlesPage = async (id) => {
  try {
    const articlesData = await getArticlesDetails(id);

    if (articlesData) {
      console.log('Статья:', articlesData);
      const contentElement = document.getElementById('app');

      contentElement.innerHTML = `
        <div class="content">
          <div class="articles-details">
            <h2 class="popular-articles__wrapper-title">
              <span contenteditable="true" id="articlesTitle">${articlesData.title}</span>
            </h2>
            <div class="popular-articles__wrapper-subtitle">
              <h3>Дата публикации/изменения :</h3>
              <p contenteditable="true" id="articlesDate">${articlesData.date}</p>
            </div>
            <div  class="ava flex mt-3">
            <h2 data-v-fee137ad="">
            Фотография для статьи :
            </h2>
            <div data-v-fee137ad="" class="img">
            <img data-v-fee137ad="" src="${articlesData.img.default}" alt="">
            </div>
            <div data-v-fee137ad="" class="add">
            <label data-v-fee137ad="" for="img-top">Загрузить новое фото:</label>
            <input data-v-fee137ad="" class="img-top-input" id="img-top" type="file" accept="image/* ">
            </div>
            </div>
           
            <div data-v-fee137ad="" class="block-btn mt-5"> 
            <button type="button" id="updateArticlesBtn" class="btn btn-block btn-success ">Сохранить изменения</button>
            <button type="button" id="deleteArticlesBtn" class="btn btn-block btn-danger "style="width: 30%;" >Удалить эту статью </button>
            </div>
          </div>       
        </div>
        <div id="errorText" class="text-danger mt-2"></div>
        <div id="messageBox" class="message-box"></div>
      `;

      const updateArticlesBtn = document.getElementById('updateArticlesBtn');
      updateArticlesBtn.addEventListener('click', async () => {
        const updatedTitle = document.getElementById('articlesTitle').innerText;
        const updatedDate = document.getElementById('articlesDate').innerText;

        const fileInput = document.getElementById('img-top');
        const file = fileInput.files[0];

        let img = articlesData.img || {};

        if (file) {
          const storageRef = ref(storage, file.name);
          await uploadBytes(storageRef, file);
          img.default = await getDownloadURL(storageRef);
        }

        await updateArticlesData(id, updatedTitle, updatedDate, {
          img,
        });
        window.location.reload();
      });

      const deleteArticlesBtn = document.getElementById('deleteArticlesBtn');
      deleteArticlesBtn.addEventListener('click', async () => {
        try {
          const confirmation = confirm(
            'Вы уверены, что хотите удалить эту статью ?'
          );
          if (!confirmation) {
            return;
          }

          await deleteArticlesData(id);

          window.location.hash = '#/admin/articles';
        } catch (error) {
          console.error('Ошибка при удалении данных из Firestore: ', error);
        }
      });
    }
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
  }
};

export const updateArticlesData = async (
  id,
  updatedTitle,
  updatedDate,
  updatedImg
) => {
  try {
    const articlesRef = doc(collection(db, 'articles'), id);

    const updateData = {
      title: updatedTitle,
      date: updatedDate,

      img: updatedImg.img,
    };

    await setDoc(articlesRef, updateData, { merge: true });

    showMessage('Данные успешно обновлены');

    console.log('Данные успешно обновлены.');
  } catch (error) {
    console.error('Ошибка при обновлении данных в Firestore: ', error);
  }
};

export const deleteArticlesData = async (id) => {
  try {
    const articlesRef = doc(collection(db, 'articles'), id);
    await deleteDoc(articlesRef);

    showMessage('Данные успешно удалены');

    console.log('Данные успешно удалены.');
  } catch (error) {
    console.error('Ошибка при удалении данных в Firestore: ', error);
  }
};

const getArticlesDetails = async (id) => {
  try {
    const articlesCollectionRef = collection(db, 'articles');
    const articlesDocRef = doc(articlesCollectionRef, id);

    const articlesSnapshot = await getDoc(articlesDocRef);

    if (articlesSnapshot.exists()) {
      return articlesSnapshot.data();
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
