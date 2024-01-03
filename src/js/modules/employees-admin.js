import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  auth,
  db,
  collection,
  addDoc,
  storage,
  getDocs,
} from './firebase-Config';

export const createCardEmploye = (id, fullName, position, imageUrl) => {
  const cardElement = document.createElement('div');
  cardElement.classList.add('specialists-card');
  cardElement.setAttribute('data-id', id);

  const cardPhoto = document.createElement('div');
  cardPhoto.classList.add('specialists-card__photo');
  const photoImg = document.createElement('img');
  photoImg.src = imageUrl;
  photoImg.alt = 'photo';
  cardPhoto.appendChild(photoImg);

  const cardName = document.createElement('h5');
  cardName.classList.add('specialists-card__name');
  cardName.textContent = fullName;

  const cardJobTitle = document.createElement('p');
  cardJobTitle.classList.add('specialists-card__job-title');
  cardJobTitle.textContent = position;

  cardElement.appendChild(cardPhoto);
  cardElement.appendChild(cardName);
  cardElement.appendChild(cardJobTitle);

  cardElement.addEventListener('click', () => {
    navigateToEmployee(id);
  });

  return cardElement;
};

export const displayEmployeInHTML = (data) => {
  const employesBody = document.getElementById('employees-body');

  employesBody.innerHTML = '';

  data.forEach((employe) => {
    const card = createCardEmploye(
      employe.id,
      employe.full_name,
      employe.position,
      employe.imageUrl
    );
    employesBody.appendChild(card);
  });
};

export const getDataFromEmployees = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'employees'));
    const dataArray = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // dataArray.push(data);
      dataArray.push(Object.assign({}, data, { id: doc.id }));
    });

    return dataArray;
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
    return [];
  }
};

const submitEmployesBtnHandler = async () => {
  const fullName = document.getElementById('full_name');
  const imgForPersonInput = document.getElementById('img-for-page');
  const position = document.getElementById('position');
  const specializations = document.getElementById('specializations');
  const education = document.getElementById('education');
  const skills = document.getElementById('skills');
  const errorText = document.getElementById('errorText');

  errorText.textContent = '';

  if (!fullName.value || !position.value || !specializations.value) {
    errorText.textContent =
      'Ошибка: Поля "Полное имя", "Должность" и "Специализации" обязательны для заполнения.';
    return;
  }

  const file = imgForPersonInput.files && imgForPersonInput.files[0];

  if (errorText.textContent) {
    errorText.textContent = '';
  }

  try {
    let imageUrl = '';

    if (file) {
      const storageRef = ref(storage, file.name);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    const docRef = await addDoc(collection(db, 'employees'), {
      imageUrl: imageUrl,
      full_name: fullName.value,
      position: position.value,
      specializations: specializations.value,
      education: education.value,
      skills: skills.value,
      // date: reservationDateInput.value,
    });

    imgForPersonInput.value = '';
    fullName.value = '';
    position.value = '';
    specializations.value = '';
    education.value = '';
    skills.value = '';
    // reservationDateInput.value = '';
  } catch (error) {
    console.error('Ошибка: ', error.message, error.code);
  }
};

export const initializeEmployeesForm = () => {
  const submitEmployesBtn = document.getElementById('submitEmployeesBtn');

  if (submitEmployesBtn) {
    submitEmployesBtn.addEventListener('click', submitEmployesBtnHandler);
  }
};
const navigateToEmployee = (employeeId) => {
  window.location.hash = `#/admin/employees/${employeeId}`;
};
