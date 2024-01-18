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

const formatDate = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, '0');
  const month = date.getMonth().toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

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

  const dateParagraph = document.createElement('p');
  dateParagraph.classList.add('patient-card__data');
  dateParagraph.textContent = date;

  cardElement.appendChild(photoWrapper);
  cardElement.appendChild(cardTitle);
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
        ? new Date(reservationDateInput.value).toLocaleDateString('ru-RU')
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

    alert('Карта статьи успешно создана');
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

export const displayArticlesPage = async (articleId) => {
  try {
    const articleData = await getArticlesDetails(articleId);

    if (articleData) {
      console.log('Статья:', articleData);
      const contentElement = document.getElementById('app');

      contentElement.innerHTML = `
        <div class="content">
          <div class="article-details">
            <h2 class="article-details__title">
              <span contenteditable="true" id="articlesTitle">${
                articleData.title
              }</span>
            </h2>
            <div class="article-details__subtitle">
              <h3>Дата публикации/изменения:</h3>
              <label for="articleDate">Текущая дата:</label>
              <input
                id="articleDate"
                type="text"
                style="width: 8%"
                value="${formatDate(articleData.date)}"
                readonly
                min="1000-01-01" 
                max="9999-12-31"  
              />
      
    
              <label for="articleDate">Редактировать дату:</label>
              <input
              id="editArticleDate"
                type="date"
                style="width: 50%"
                value="${formatDate(articleData.date)}"
                min="1000-01-01" 
                max="9999-12-31"  
              />
            </div>
            <div class="article-image flex mt-3">
              <h2>
                Изображение для статьи:
              </h2>
              <div class="img">
                <img src="${
                  articleData.img.default
                }" alt="" style="max-width: 100%;">
              </div>
              <div class="add">
                <label for="img-top">Загрузить новое изображение:</label>
                <input class="img-top-input" id="img-top" type="file" accept="image/* ">
              </div>
            </div>
            <div class="block-btn mt-5"> 
              <button type="button" id="updateArticleInfoBtn" class="btn btn-block btn-success ">Сохранить изменения</button>
              <button type="button" id="deleteArticleBtn" class="btn btn-block btn-danger " style="width: 30%;" >Удалить эту статью </button>
            </div>
          </div>       
        </div>
        <div id="errorText" class="text-danger mt-2"></div>
        <div id="messageBox" class="message-box"></div>
      `;

      const articleTitleElement = document.getElementById('articlesTitle');
      const articleDateElement = document.getElementById('articleDate');

      articleTitleElement.addEventListener('input', () => {
        limitTextLength(articleTitleElement, 70);
      });

      articleDateElement.addEventListener('input', () => {
        const date = new Date(articleDateElement.value);
        const formattedDate = formatDate(date);
        articleDateElement.value = formattedDate;
      });

      const editArticleDateElement = document.getElementById('editArticleDate');

      const updateDataOnDateChange = (formattedEditedDate) => {
        currentArticleDate = formattedEditedDate;
      };

      if (editArticleDateElement) {
        editArticleDateElement.addEventListener('input', () => {
          const editedDate = new Date(editArticleDateElement.value);

          updateDataOnDateChange(formatDate(editedDate));
        });
      }

      let currentArticleDate = formatDate(new Date());

      const editArticleDateInput = document.getElementById('editArticleDate');

      if (editArticleDateInput) {
        editArticleDateInput.value = currentArticleDate;

        editArticleDateInput.addEventListener('input', () => {
          const editedDate = new Date(editArticleDateInput.value);
          currentArticleDate = formatDate(editedDate);
        });
      }

      const updateArticleInfoBtn = document.getElementById(
        'updateArticleInfoBtn'
      );

      if (updateArticleInfoBtn) {
        updateArticleInfoBtn.addEventListener('click', async () => {
          const updatedTitle =
            document.getElementById('articlesTitle').innerText;
          const updatedDate = currentArticleDate;

          const fileInput = document.getElementById('img-top');
          const file = fileInput.files[0];

          let img = articleData.img || {};

          if (file) {
            const storageRef = ref(storage, file.name);
            await uploadBytes(storageRef, file);
            img.default = await getDownloadURL(storageRef);
          }

          await updateArticleData(articleId, updatedTitle, updatedDate, {
            img,
          });
          location.reload();
        });
      }

      const deleteArticleBtn = document.getElementById('deleteArticleBtn');
      deleteArticleBtn.addEventListener('click', async () => {
        try {
          const confirmation = confirm(
            'Вы уверены, что хотите удалить эту статью ?'
          );
          if (!confirmation) {
            return;
          }

          await deleteArticleData(articleId);

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

export const updateArticleData = async (
  articleId,
  updatedTitle,
  updatedDate,
  updatedImg
) => {
  try {
    const articleRef = doc(collection(db, 'articles'), articleId);

    const updateData = {
      title: updatedTitle,
      date: updatedDate,
      img: updatedImg.img,
    };

    await setDoc(articleRef, updateData, { merge: true });

    showMessage('Данные успешно обновлены');

    console.log('Данные успешно обновлены.');
  } catch (error) {
    console.error('Ошибка при обновлении данных в Firestore: ', error);
  }
};

export const deleteArticleData = async (articleId) => {
  try {
    const articleRef = doc(collection(db, 'articles'), articleId);
    await deleteDoc(articleRef);

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
      const articleData = articlesSnapshot.data();
      if (articleData.date) {
        articleData.date = new Date(articleData.date).toLocaleDateString(
          'ru-RU'
        );
      }
      return articleData;
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
