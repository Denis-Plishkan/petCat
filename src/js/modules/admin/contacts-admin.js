import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { parse, format, isValidNumber } from 'libphonenumber-js';
import JustValidate from 'just-validate';

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

const generateRoutesHtml = (routes) => {
  if (!routes) return '';

  return Object.keys(routes)
    .map((routeType) => {
      const route = routes[routeType];

      return `
      <div class="mt-3">
        <div class="route-container" data-type="${routeType}">
          ${route.text
            .map(
              (point, index) => `
            <div class="route-item">
              <textarea class="route-textarea" data-index="${index}" data-type="${routeType}">${point}</textarea>
              <button class="delete-route-btn" data-index="${index}" data-type="${routeType}">Удалить</button>
            </div>
          `
            )
            .join('')}
          <button class="add-route-btn" data-type="${routeType}">Добавить</button>
        </div>
      </div>
    `;
    })
    .join('');
};

const submitContactsBtnHandler = async () => {
  // const phoneNumberInput = document.getElementById('phone_number');
  // const phoneNumber = result.formattedPhoneNumber;
  const phoneNumberInput = document.getElementById('phone_number');

  const imgForPageInput = document.getElementById('img-for-page');
  const email = document.getElementById('email');
  const address = document.getElementById('address');
  const addressMap = document.getElementById('address_map');
  const workingHours = document.getElementById('working_hours');
  const roadByBus = document.getElementById('road_by_bus');
  const roadTrolleybus = document.getElementById('road_trolleybus');
  const roadCar = document.getElementById('road_car');
  const errorText = document.getElementById('errorText');

  errorText.textContent = '';
  ////////первая реализация
  // const isValidUkrainianNumber = isValidNumber(phoneNumber, 'UA');

  // if (!isValidUkrainianNumber) {
  //   errorText.textContent = 'Введите корректный номер телефона';
  //   return;
  // }

  // const parsedPhoneNumber = parse(phoneNumber, 'UA');

  // // const formattedPhoneNumber = format(parsedPhoneNumber, 'International')
  // //   .replace(/^(\+38)(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
  // //   .replace(/ /g, '');

  // // const formattedPhoneNumber = format(
  // //   parsedPhoneNumber,
  // //   'International_plaintext'
  // // )
  // //   .replace(/^(\+380)/, '+38')
  // //   .replace(/^(\+38)(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 ($2) $3-$4-$5')
  // //   .replace(/ /g, '');
  // const formattedPhoneNumber = format(
  //   parsedPhoneNumber,
  //   'International'
  // ).replace(/^\+(\d{2})(\d{3})(\d{2})(\d{2})$/, '+$1 ($2) $3-$4');

  // console.log('Номер:', formattedPhoneNumber);
  try {
    const countryCode = 'UA';

    const result = formatAndValidatePhoneNumber(phoneNumber, countryCode);

    if (!result.success) {
      errorText.textContent = result.errorMessage;
      return;
    }

    let imageUrl = '';
    const file = imgForPageInput.files[0];

    if (file) {
      const storageRef = ref(storage, file.name);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    const docRef = await addDoc(collection(db, 'contacts'), {
      imageUrl: imageUrl,
      email: email.value,
      address: address.value,
      addressMap: addressMap.value,
      workingHours: workingHours.value,
      roadByBus: roadByBus.value,
      roadTrolleybus: roadTrolleybus.value,
      roadCar: roadCar.value,
      // phoneNumber: formattedPhoneNumber,
      // phoneNumber: result.formattedPhoneNumber,
      // phoneNumber: phoneNumber,
      phoneNumber: phoneNumber.value,
    });

    console.log('Документ успешно добавлен с ID: ', docRef.id);

    imgForPageInput.value = '';
    phoneNumberInput.value = '';
    email.value = '';
    address.value = '';
    addressMap.value = '';
    workingHours.value = '';
    roadByBus.value = '';
    roadTrolleybus.value = '';
    roadCar.value = '';
  } catch (error) {
    console.error('Ошибка: ', error.message, error.code);
    errorText.textContent = error.message;
  }
};

const formatAndValidatePhoneNumber = (phoneNumberString, countryCode) => {
  try {
    // Приводим phoneNumberString к строке, если это не строка
    const phoneNumber =
      typeof phoneNumberString === 'string'
        ? phoneNumberString
        : String(phoneNumberString);

    const phoneNumberData = parse(phoneNumber, countryCode);

    if (isValidNumber(phoneNumberData, countryCode)) {
      const formattedPhoneNumber = format(phoneNumberData, 'International');
      console.log('Номер:', formattedPhoneNumber);
      return { success: true, formattedPhoneNumber };
    } else {
      return {
        success: false,
        errorMessage: 'Некорректный номер телефона',
        formattedPhoneNumber: '',
      };
    }
  } catch (error) {
    console.error('Ошибка при разборе номера:', error.message);
    return {
      success: false,
      errorMessage: 'Ошибка при разборе номера',
      formattedPhoneNumber: '',
    };
  }
};

export const initializeContactsForm = () => {
  const submitContactsBtn = document.getElementById('submitCotactsBtn');
  const phoneNumberInput = document.getElementById('phone_number');
  const emailInput = document.getElementById('email');
  const countryCode = 'UA';

  if (phoneNumberInput && emailInput) {
    phoneNumberInput.setAttribute('inputmode', 'numeric');
    phoneNumberInput.addEventListener('keydown', (event) => {
      const key = event.key;
      if (
        !/[\d\s\(\)\-\+\*]/.test(key) &&
        key !== 'Backspace' &&
        key !== 'Delete' &&
        key !== 'ArrowLeft' &&
        key !== 'ArrowRight'
      ) {
        event.preventDefault();
      }
    });

    phoneNumberInput.addEventListener('input', () => {
      const formattedPhoneNumber = formatAndValidatePhoneNumber(
        phoneNumberInput.value,
        countryCode
      );
      if (formattedPhoneNumber.success) {
        phoneNumberInput.value = formattedPhoneNumber.formattedPhoneNumber;
      } else {
        console.log('Invalid phone number');
      }
    });

    // Используйте JustValidate для валидации поля email
    const validator = new JustValidate('.content.contacts', {
      rule: 'customRegexp',
      value: /^[a-zA-Z0-9.-]+@[^\s@]+\.[\p{L}]{2,}$/u,
      errorMessage: 'Email is invalid',
      messages: {
        email: {
          required: 'Поле с почтой обязательно для заполнения',
          email: 'Введите корректный адрес электронной почты',
        },
      },
    });

    // Добавляем обработчик изменений в поле почты для динамической валидации
    emailInput.addEventListener('input', () => {
      validator.validateInput(emailInput);
    });
  }

  if (submitContactsBtn) {
    submitContactsBtn.addEventListener('click', submitContactsBtnHandler);
  }
};

export const getDataFromContacts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'contacts'));
    const dataArray = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const contact = {
        id: doc.id,
        imageUrl: data.imageUrl || '',
        email: data.email || '',
        address: data.address || '',
        addressMap: data.addressMap || '',
        workingHours: data.workingHours || '',
        roadByBus: Array.isArray(data.roadByBus)
          ? data.roadByBus
          : [data.roadByBus],
        roadCar: Array.isArray(data.roadCar) ? data.roadCar : [data.roadCar],
        roadTrolleybus: Array.isArray(data.roadTrolleybus)
          ? data.roadTrolleybus
          : [data.roadTrolleybus],
      };

      dataArray.push(contact);
    });
    console.log('Данные', dataArray);

    return dataArray;
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
    return [];
  }
};

export const displayContactPage = async (id) => {
  try {
    const contactsData = await getDataFromContacts(id);

    if (contactsData && contactsData.length > 0) {
      const contact = contactsData[0];

      const formattedPhoneNumber = formatAndValidatePhoneNumber(
        contact.phoneNumber,
        'UA'
      );

      const content = `
        <div class="content contacts">
          <h2>Редактирование контактов</h2>
          <div class="form-group">
            <label>Номер телефона:</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-phone"></i></span>
              </div>
              <input id="phone_number" type="text" class="form-control" value="${
                contact.phoneNumber
              }">
            </div>
          </div>

          <div class="mt-3">
            <label for="title">Адрес:</label>
            <input id="address" type="text" placeholder="Адрес" style="width: 50%" value="${
              contact.address
            }" />
          </div>

          <div class="mt-3">
            <label for="title">Время работы:</label>
            <input id="workingHours" type="text" placeholder="Время работы" style="width: 50%" value="${
              contact.workingHours
            }" />
          </div>

          <div class="map__wrapper">
            <div class="map__wrapper-left">
              <iframe src="${
                contact.addressMap
              }" width="600" height="450" style="border: 0" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>

          <div class="mt-3">
            <label for="title">Електронная почта:</label>
            <input id="email" class="validate-email" type="text" placeholder="Електронная почта" style="width: 50%" value="${
              contact.email
            }" />
            <div id="emailValidationError" class="text-danger mt-2"></div>
          </div>

          <div class="mt-3">
            <label for="roadByBus">На Автобусе:</label>
            <div class="route-container">
              ${generateRoutesHtml(contact.roadByBus || [])}
              <button class="add-route-btn" data-type="roadByBus">Добавить</button>
            </div>
          </div>

          <!-- Добавьте аналогичные блоки HTML для остальных полей формы -->

          <div class="mt-5">
            <button data-form-type="employees" id="editCotactsBtn" type="button" class="btn btn-block btn-success btn-lg">
              Сохранить изменения
            </button>
            <div id="errorText" class="text-danger mt-2"></div>
          </div>
        </div>
      `;

      const appElement = document.getElementById('app');
      if (appElement) {
        appElement.innerHTML = content;

        const validator = new JustValidate('.content.contacts', {
          rule: 'customRegexp',
          value: /^[a-zA-Z0-9.-]+@[^\s@]+\.[\p{L}]{2,}$/u,
          errorMessage: 'Email is invalid',
        });

        const editCotactsBtn = document.getElementById('editCotactsBtn');
        editCotactsBtn.addEventListener('click', async () => {
          const updatedPhoneNumber =
            document.getElementById('phone_number').value;
          const updatedAddress = document.getElementById('address').value;
          const updateWorkingHours =
            document.getElementById('workingHours').value;
          const updateEmail = document.getElementById('email').value;
          const updatedRoadByBus = collectRoutes('roadByBus');
          const updatedRoadCar = collectRoutes('roadCar');
          const updatedRoadTrolleybus = collectRoutes('roadTrolleybus');

          await updateContactData(
            contact.id,
            updatedPhoneNumber,
            updatedAddress,
            updateWorkingHours,
            updateEmail,
            updatedRoadByBus,
            updatedRoadCar,
            updatedRoadTrolleybus
          );

          // window.location.reload();
        });
      } else {
        console.error('Element with id "app" not found.');
      }
    } else {
      const content = `<p>Контакты не найдены.</p>`;
      const appElement = document.getElementById('app');
      if (appElement) {
        appElement.innerHTML = content;
      } else {
        console.error('Element with id "app" not found.');
      }
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных: ', error);
    const content = `<p>Произошла ошибка при загрузке данных.</p>`;
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = content;
    } else {
      console.error('Element with id "app" not found.');
    }
  }
};

const collectRoutes = (routeType) => {
  const routeItems = document.querySelectorAll(
    `.route-container[data-type="${routeType}"] .route-item`
  );
  const routes = [];

  routeItems.forEach((item) => {
    const textarea = item.querySelector('.route-textarea');

    routes.push({ text: textarea.value, title: 'Название маршрута' });
  });

  return routes;
};

document.addEventListener('click', (event) => {
  const target = event.target;

  if (target.classList.contains('add-route-btn')) {
    const routeType = target.dataset.type;
    const routeContainer = target.parentElement;
    const routeItem = document.createElement('div');
    routeItem.classList.add('route-item');
    routeItem.innerHTML = `
      <textarea class="route-textarea" data-type="${routeType}"></textarea>
      <button class="delete-route-btn" data-type="${routeType}">Удалить</button>
    `;
    routeContainer.insertBefore(routeItem, target);
  }

  if (target.classList.contains('delete-route-btn')) {
    const routeItem = target.parentElement;
    routeItem.remove();
  }
});

export const updateContactData = async (
  id,
  updatedPhoneNumber,
  updatedAddress,
  updateWorkingHours,
  updateEmail,
  updatedRoadByBus,
  updatedRoadCar,
  updatedRoadTrolleybus
) => {
  try {
    const contactRef = doc(collection(db, 'contacts'), id);

    const updateData = {
      phoneNumber: updatedPhoneNumber,
      address: updatedAddress,
      workingHours: updateWorkingHours,
      email: updateEmail,
      roadByBus: updatedRoadByBus.map((text) => ({
        text,
        title: 'На Автобусе',
      })),
      roadCar: updatedRoadCar.map((text) => ({ text, title: 'На автомобиле' })),
      roadTrolleybus: updatedRoadTrolleybus.map((text) => ({
        text,
        title: 'На Троллейбусе',
      })),
    };

    await setDoc(contactRef, updateData, { merge: true });

    showMessage('Данные успешно обновлены');

    console.log('Данные успешно обновлены.');
  } catch (error) {
    console.error('Ошибка при обновлении данных в Firestore: ', error);
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

const formatPhoneNumber = (phoneNumberString, countryCode) => {
  try {
    const phoneNumber = parse(phoneNumberString, countryCode);
    if (isValidNumber(phoneNumber, countryCode)) {
      return format(phoneNumber, 'International');
    }
    return phoneNumberString; // Возвращаем исходное значение, если номер некорректный
  } catch (error) {
    console.error('Ошибка при форматировании номера:', error.message);
    return phoneNumberString;
  }
};
