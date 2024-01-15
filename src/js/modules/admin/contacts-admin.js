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

const submitContactsBtnHandler = async () => {
  const phoneNumberInput = document.getElementById('phone_number');
  const phoneNumber = phoneNumberInput.value;
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
      phoneNumber: result.formattedPhoneNumber,
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
    const phoneNumber = parse(phoneNumberString, countryCode);

    if (isValidNumber(phoneNumber, countryCode)) {
      const formattedPhoneNumber = format(phoneNumber, 'International');
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

  if (submitContactsBtn) {
    submitContactsBtn.addEventListener('click', submitContactsBtnHandler);
  }
};

export const getDataFromContacts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'contacts'));
    const dataArray = [];

    querySnapshot.docs.forEach((doc) => {
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

export const displayContactPage = async (id) => {
  try {
    const contactsData = await getDataFromContacts(id);

    if (contactsData && contactsData.length > 0) {
      const contact = contactsData[0];

      const formattedPhoneNumber = formatAndValidatePhoneNumber(
        contact.phoneNumber,
        'UA'
      );

      const content = ` <div class="content">
      <h2>Редактирование контактов</h2>

      <div class="form-group">
        <label>Номер телефона:</label>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text"><i class="fas fa-phone"></i></span>
          </div>
          <input id="phone_number" type="text" class="form-control" value="${contact.formattedPhoneNumber}">
        </div>
      </div>

      <div class="mt-3">
        <label for="title">Адрес:</label>
        <input
          id="address"
          type="text"
          placeholder="Адрес"
          style="width: 50%"
          value="${contact.address}"
        />
      </div>

      <div class="mt-3">
        <label for="title">Время работы:</label>
        <input
          id="workingHours"
          type="text"
          placeholder="Время работы"
          style="width: 50%"
          value="${contact.workingHours}"
        />
      </div>

     

      <div class="map__wrapper">
        <div class="map__wrapper-left">
        <iframe
        src="${contact.addressMap}"
        width="600"
        height="450"
        style="border: 0"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
      
        </div>
      </div>

      <div class="mt-3">
        <label for="title">Електронная почта:</label>
        <input
          id="email"
          type="text"
          placeholder="Електронная почта"
          style="width: 50%"
          value="${contact.email}"
        />
      </div>

      <div class="mt-5">
        <button
          data-form-type="employees"
          id="editCotactsBtn"
          type="button"
          class="btn btn-block btn-success btn-lg"
        >
          Сохранить изменения
        </button>
        <div id="errorText" class="text-danger mt-2"></div>
      </div>
    </div>
  `;

      const appElement = document.getElementById('app');
      if (appElement) {
        appElement.innerHTML = content;

        const editCotactsBtn = document.getElementById('editCotactsBtn');

        editCotactsBtn.addEventListener('click', async () => {
          const updatedPhoneNumber =
            document.getElementById('phone_number').value;
          const updatedAddress = document.getElementById('address').value;
          const updateWorkingHours =
            document.getElementById('workingHours').value;
          const updateEmail = document.getElementById('email').value;

          console.log(contact.id);
          await updateContactData(
            contact.id,
            updatedPhoneNumber,
            updatedAddress,
            updateWorkingHours,
            updateEmail
          );
          window.location.reload();
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

export const updateContactData = async (
  id,
  updatedPhoneNumber,
  updatedAddress,
  updateWorkingHours,
  updateEmail
) => {
  try {
    const contactRef = doc(collection(db, 'contacts'), id);

    const updateData = {
      phoneNumber: updatedPhoneNumber,
      address: updatedAddress,
      workingHours: updateWorkingHours,
      email: updateEmail,
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
