import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  auth,
  db,
  collection,
  addDoc,
  storage,
  getDocs,
} from './firebase-Config';

const formatPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');

  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  }

  return phoneNumber;
};

const submitContactsBtnHandler = async () => {
  console.log('Кнопка нажата!');
  const phoneNumberInput = document.getElementById('phone_number');
  const phoneNumber = phoneNumberInput.value;
  const imgForPageInput = document.getElementById('img-for-page');
  const email = document.getElementById('email');
  const address = document.getElementById('address');
  const addressMap = document.getElementById('address_map');
  const workingHours = document.getElementById('working_hours');
  const roadByBus = document.getElementById('road_by_bus');
  const roadTrolleybus = document.getElementById('road_trolleybus');
  const roadCar = document.getElementById('road_car').value;
  const errorText = document.getElementById('errorText');

  errorText.textContent = '';

  const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

  const file = imgForPageInput.files[0];

  if (errorText) {
    errorText.textContent = '';
  } else {
    // console.error('Элемент errorText не найден!');
  }

  try {
    let imageUrl = '';

    if (file) {
      const storageRef = ref(storage, file.name);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
      console.log('URL фотографии:', imageUrl);
    }

    const docRef = await addDoc(collection(db, 'contacts'), {
      phoneNumber: formattedPhoneNumber,
      imageUrl: imageUrl,
      email: email.value,
      address: address.value,
      addressMap: addressMap.value,
      workingHours: workingHours.value,
      roadByBus: roadByBus.value,
      roadTrolleybus: roadTrolleybus.value,
      roadCar: roadCar.value,
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
  }
};

export const initializeContactsForm = () => {
  const submitContactsBtn = document.getElementById('submitCotactsBtn');

  if (submitContactsBtn) {
    submitContactsBtn.addEventListener('click', submitContactsBtnHandler);
  }
};
