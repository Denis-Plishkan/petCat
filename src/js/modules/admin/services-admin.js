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

const createCard = (id, title, description) => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('popular-services__card');
  // cardElement.setAttribute('data-id', doc.id);
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
          navigateToService(data[j].id);
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

    // querySnapshot.forEach((doc) => {
    //   const data = doc.data();
    //   dataArray.push(data);
    //   console.log('ID документа:', doc.id);
    // });
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      // dataArray.push({ ...data, id: doc.id });
      dataArray.push(Object.assign({}, data, { id: doc.id }));
    });
    console.log('Данные', dataArray);

    return dataArray;
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
    return [];
  }
};

const navigateToService = (id) => {
  window.location.hash = `#/admin/services/${id}`;
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

export const displayServicePage = async (id) => {
  try {
    const serviceData = await getServiceDetails(id);

    if (serviceData) {
      const contentElement = document.getElementById('app');

      contentElement.innerHTML = `
        <div class="content">
          <div class="service-details">
            <h2 class="popular-services__wrapper-title">
              <span contenteditable="true" id="serviceTitle">${serviceData.title}</span>
            </h2>
            <div class="popular-services__wrapper-subtitle">
              <h3>Краткое описание:</h3>
              <p contenteditable="true" id="serviceDescription">${serviceData.description}</p>
            </div>
            <div  class="ava flex mt-3">
            <h2 data-v-fee137ad="">
            Главная картинка:
            </h2>
            <div data-v-fee137ad="" class="img">
            <img data-v-fee137ad="" src="${serviceData.imageUrl}" alt="">
            </div>
            <div data-v-fee137ad="" class="add">
            <label data-v-fee137ad="" for="img-top">Загрузить новое фото:</label>
            <input data-v-fee137ad="" class="img-top-input" id="img-top" type="file" accept="image/* ">
            </div>
            </div>
             <div class="popular-services__wrapper-text">
             <h3>Текст для статьи:</h3>
            <textarea data-v-fee137ad="" id="serviceText" placeholder="Текст для статьи"  cols="30" rows="10" style="width: 100%; height: 100px; resize: none;">${serviceData.text}</textarea>
            </div>
            <div data-v-fee137ad="" class="block-btn mt-5"> 
            <button id="updateServiceBtn" class="btn btn-block btn-success ">Сохранить изменения</button>
            </div>
          </div>       
        </div>
        <div id="errorText" class="text-danger mt-2"></div>
        <div id="messageBox" class="message-box"></div>
      `;

      const updateServiceBtn = document.getElementById('updateServiceBtn');
      updateServiceBtn.addEventListener('click', async () => {
        const updatedTitle = document.getElementById('serviceTitle').innerText;
        const updatedDescription =
          document.getElementById('serviceDescription').innerText;
        const updatedText = document.getElementById('serviceText').value;

        const fileInput = document.getElementById('img-top');
        const file = fileInput.files[0];

        let imageUrl = serviceData.imageUrl;

        if (file) {
          const storageRef = ref(storage, file.name);
          await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(storageRef);
        }
        if (file) {
          const storageRef = ref(storage, file.name);
          await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(storageRef);
        }

        await updateServiceData(
          id,
          updatedTitle,
          updatedDescription,
          updatedText,
          imageUrl
        );
        window.location.reload();
      });
    } else {
      console.error('Документ с указанным идентификатором не найден.');
    }
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
  }
};

export const updateServiceData = async (
  id,
  updatedTitle,
  updatedDescription,
  updatedText,
  updatedImageUrl
) => {
  try {
    const serviceRef = doc(collection(db, 'services'), id);

    const updateData = {
      title: updatedTitle,
      description: updatedDescription,
      text: updatedText,
      imageUrl: updatedImageUrl,
    };

    await setDoc(serviceRef, updateData, { merge: true });

    showMessage('Данные успешно обновлены');

    console.log('Данные успешно обновлены.');
  } catch (error) {
    console.error('Ошибка при обновлении данных в Firestore: ', error);
  }
};

const getServiceDetails = async (id) => {
  try {
    const serviceCollectionRef = collection(db, 'services');
    const serviceDocRef = doc(serviceCollectionRef, id);

    const serviceSnapshot = await getDoc(serviceDocRef);

    if (serviceSnapshot.exists()) {
      return serviceSnapshot.data();
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
