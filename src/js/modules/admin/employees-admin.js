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
import {
  getSpecializationsList,
  updateSpecializationsSection,
} from './specializations-admin';

import { displaySkills } from './skills';

const limitTextLength = (element, maxLength) => {
  const text = element.innerText || element.value;
  if (text.length > maxLength) {
    element.innerText = text.substring(0, maxLength);
    element.value = text.substring(0, maxLength);
  }
};

const createCardEmploye = (id, fullName, position, data, imageUrl) => {
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

  const cardSpecializations = document.createElement('p');
  cardSpecializations.classList.add('specialists-card__specializations');

  if (data.specializations && data.specializations.length > 0) {
    cardSpecializations.textContent = `Специализации: ${data.specializations.join(
      ', '
    )}`;
  } else {
    cardSpecializations.textContent = 'Специализации: Нет данных';
  }

  cardElement.appendChild(cardPhoto);
  cardElement.appendChild(cardName);
  cardElement.appendChild(cardJobTitle);
  cardElement.appendChild(cardSpecializations);

  return cardElement;
};

export const displayEmployeInHTML = (data) => {
  const employeesBody = document.getElementById('employees-body');

  if (employeesBody) {
    employeesBody.innerHTML = '';

    for (let i = 0; i < data.length; i += 3) {
      const line = document.createElement('div');
      line.classList.add('specialists-line');

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('specialists-card__wrapper');

      for (let j = i; j < i + 3 && j < data.length; j++) {
        const card = createCardEmploye(
          data[j].id,
          data[j].full_name,
          data[j].position,
          data[j] || [],
          data[j].img.default
        );

        card.addEventListener('click', () => {
          navigateToEmployee(data[j].id);
        });
        cardWrapper.appendChild(card);
      }

      line.appendChild(cardWrapper);
      employeesBody.appendChild(line);
    }
  }
};

export const getDataFromEmployees = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'employees'));
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

const navigateToEmployee = (id) => {
  window.location.hash = `#/admin/employees/${id}`;
};

const submitEmployesBtnHandler = async () => {
  const fullName = document.getElementById('full_name');
  const imgForPersonInput = document.getElementById('img-for-page');
  const position = document.getElementById('position');
  const specializationsSelect = document.getElementById('specializations');
  const selectedSpecializations = Array.from(
    specializationsSelect.selectedOptions
  ).map((option) => option.value);
  const skills = document.getElementById('skills');

  const education = {};

  const diplomasYearInputs = document.querySelectorAll('.diploma-year-input');
  const diplomasPlaceInputs = document.querySelectorAll('.diploma-place-input');

  education.diplomas = [];

  for (let i = 0; i < diplomasYearInputs.length; i++) {
    const year = diplomasYearInputs[i].value.trim();
    const place = diplomasPlaceInputs[i].value.trim();

    if (year && place) {
      education.diplomas.push({
        year: year,
        place: place,
      });
    }
  }

  const othersYearInputs = document.querySelectorAll('.others-year-input');
  const othersPlaceInputs = document.querySelectorAll('.others-place-input');

  education.others = [];

  for (let i = 0; i < othersYearInputs.length; i++) {
    const year = othersYearInputs[i].value.trim();
    const place = othersPlaceInputs[i].value.trim();

    if (year && place) {
      education.others.push({
        year: year,
        place: place,
      });
    }
  }

  const errorText = document.getElementById('errorText');
  errorText.textContent = '';
  if (
    !fullName.value ||
    !position.value ||
    !specializations.value ||
    !imgForPersonInput.files
  ) {
    errorText.textContent =
      'Ошибка: Поля "Полное имя", "Фотография", "Должность" и "Специализации" обязательны для заполнения.';
    return;
  }

  const file = imgForPersonInput.files && imgForPersonInput.files[0];
  try {
    let imageUrl = '';

    if (file) {
      const storageRef = ref(storage, file.name);
      await uploadBytes(storageRef, file);
      imageUrl = await getDownloadURL(storageRef);
    }

    const docRef = await addDoc(collection(db, 'employees'), {
      full_name: fullName.value,
      position: position.value,
      specializations: selectedSpecializations,
      skills: skills.value,
      education: education,
      img: {
        default: imageUrl,
        webP: '',
      },
      // date: reservationDateInput.value,
    });

    imgForPersonInput.value = '';
    fullName.value = '';
    position.value = '';
    specializations.value = '';
    education.value = '';
    skills.value = '';
    // reservationDateInput.value = '';

    alert('Карта работника успешно создана');
  } catch (error) {
    console.error('Ошибка: ', error.message, error.code);
  }
};

function previewImage() {
  const previewImage = document.getElementById('previewImage');
  const fileInput = document.getElementById('img-top');

  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    // Сбросите предварительный просмотр, если файл не выбран
    previewImage.src = ``;
  }
}

export const initializeEmployeesForm = async () => {
  const submitEmployesBtn = document.getElementById('submitEmployeesBtn');
  const specializationsSelect = document.getElementById('specializations');

  if (submitEmployesBtn && specializationsSelect) {
    submitEmployesBtn.addEventListener('click', submitEmployesBtnHandler);

    const specializations = await getSpecializationsList();

    specializationsSelect.innerHTML = '';

    specializations.forEach((specialization) => {
      const option = document.createElement('option');
      option.value = specialization;
      option.text = specialization;
      specializationsSelect.add(option);
    });

    $(specializationsSelect).select2({
      multiple: true,
    });
  }

  const imgTopInput = document.getElementById('img-top');
  const imgForPageInput = document.getElementById('img-for-page');
  const previewImageElement = document.getElementById('previewImage');

  if (imgTopInput) {
    imgTopInput.addEventListener('change', previewImage);
  }

  if (imgForPageInput && previewImageElement) {
    imgForPageInput.addEventListener('change', previewImage);
  }
};

export const displayEmployeesPage = async (id) => {
  try {
    const employeesData = await getEmployeesDetails(id);

    if (employeesData) {
      console.log('Данные paботника:', employeesData);
      const contentElement = document.getElementById('app');

      contentElement.innerHTML = `
        <div class="content">


          <div class="employees-details">
            <h2 class="employees__wrapper-title">
              <span contenteditable="true" id="employeesName">${employeesData.full_name}</span>
            </h2>
            <div class="employees__wrapper-subtitle">
              <h3>Должность:</h3>
              <p contenteditable="true" id="employeesPosition">${employeesData.position}</p>
            </div>
     
            <div class="employees__wrapper-subtitle">
            <h3>Специализации:</h3>
            <div id="specializationsContainer"></div>
            <button id="addSpecializationBtn">Добавить специализацию</button>
          </div>
          <div class="employees__wrapper-subtitle">
          <div id="skillsList"></div>
          <button id="addSkillPointBtn">Добавить навык</button>
          
          <div class="ava flex mt-3">
          <h2 data-v-fee137ad="">
              Фотография работника:
          </h2>
          <div data-v-fee137ad="" class="img">
              <img data-v-fee137ad="" src="${employeesData.img.default}" alt="" id="previewImage" style="max-width: 100%;">
          </div>
          <div data-v-fee137ad="" class="add">
              <label data-v-fee137ad="" for="img-top">Загрузить новое фото:</label>
              <input data-v-fee137ad="" class="img-top-input" id="img-top" type="file" accept="image/*">

          </div>
      </div>
      
           
            <div data-v-fee137ad="" class="block-btn mt-5"> 
            <button type="button" id="updateEmployeesBtn" class="btn btn-block btn-success ">Сохранить изменения</button>
            <button type="button" id="deleteEmployeesBtn" class="btn btn-block btn-danger "style="width: 30%;" >Удалить карту работника</button>
            </div>
          </div>       
        </div>
        <div id="errorText" class="text-danger mt-2"></div>
        <div id="messageBox" class="message-box"></div>
      `;
      // console.log('Навыки сотрудника:', employeesData.skills);

      displaySkills(employeesData.skills);

      const addSkillBtn = document.getElementById('addSkillBtn');
      const imgTopInput = document.getElementById('img-top');
      if (imgTopInput) {
        imgTopInput.addEventListener('change', previewImage);
      }

      const employeesNameElement = document.getElementById('employeesName');
      const employeesPositionElement =
        document.getElementById('employeesPosition');
      const serviceTextElement = document.getElementById('employeesPosition');

      employeesNameElement.addEventListener('input', () => {
        limitTextLength(employeesNameElement, 70);
      });

      employeesPositionElement.addEventListener('input', () => {
        limitTextLength(employeesPositionElement, 20);
      });

      serviceTextElement.addEventListener('input', () => {
        limitTextLength(serviceTextElement, 500);
      });
      if (addSkillBtn) {
        addSkillBtn.addEventListener('click', async () => {
          const skillsListElement = document.getElementById('skillsList');
          const addSkillPointBtnElement =
            document.getElementById('addSkillPointBtn');

          displaySkills(
            { title: '', points: [] },
            skillsListElement,
            addSkillPointBtnElement
          );
        });
      }

      const educationContainer = document.getElementById('educationContainer');
      const addDiplomaBtn = document.getElementById('addDiplomaBtn');
      const addOthersBtn = document.getElementById('addOthersBtn');
      if (educationContainer && addDiplomaBtn && addOthersBtn) {
        displayEducation(educationContainer, employeesData.education);

        addDiplomaBtn.addEventListener('click', addDiplomaField);
        addOthersBtn.addEventListener('click', addOthersField);
      }

      //кнопки
      const updateEmployeesBtn = document.getElementById('updateEmployeesBtn');
      updateEmployeesBtn.addEventListener('click', async () => {
        const updatedFullName =
          document.getElementById('employeesName').innerText;
        const updatedPosition =
          document.getElementById('employeesPosition').innerText;

        const updatedSkillsPoints = [];
        const pointInputs = document.querySelectorAll('.point-input');
        pointInputs.forEach((input) => {
          updatedSkillsPoints.push(input.value);
        });

        const fileInput = document.getElementById('img-top');
        const file = fileInput.files[0];
        const updatedImg = employeesData.img || {};

        if (file) {
          const storageRef = ref(storage, file.name);
          await uploadBytes(storageRef, file);
          updatedImg.default = await getDownloadURL(storageRef);
        }

        const updatedSpecializations = employeesData.specializations;

        const updatedEducation = getUpdatedEducation();
        updatedData.education = updatedEducation;

        await updateEmployeesData(
          id,
          updatedFullName,
          updatedPosition,
          updatedSpecializations,
          { points: updatedSkillsPoints },
          { default: updatedImg.default },
          updatedEducation
        );

        // window.location.reload();
      });

      const deleteEmployeesBtn = document.getElementById('deleteEmployeesBtn');
      deleteEmployeesBtn.addEventListener('click', async () => {
        try {
          const confirmation = confirm(
            'Вы уверены, что хотите удалить этого работника?'
          );
          if (!confirmation) {
            return;
          }

          await deleteEmployeeData(id);

          window.location.hash = '#/admin/employees';
        } catch (error) {
          console.error('Ошибка при удалении данных из Firestore: ', error);
        }
      });
      //
      updateSpecializationsSection(id, employeesData);
    }
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
  }
};

// updatedEducation,
// education: updatedEducation,

export const updateEmployeesData = async (
  id,
  updatedFullName,
  updatedPosition,
  updatedSpecializations,
  updatedSkills,
  updatedImg
) => {
  try {
    const employeeRef = doc(collection(db, 'employees'), id);

    const updateData = {
      full_name: updatedFullName,
      position: updatedPosition,
      specializations: updatedSpecializations,

      skills: {
        points: updatedSkills.points,
      },
      img: {
        default: updatedImg.default,
      },
    };

    await setDoc(employeeRef, updateData, { merge: true });

    showMessage('Данные успешно обновлены');

    console.log('Данные успешно обновлены.');
  } catch (error) {
    console.error('Ошибка при обновлении данных в Firestore: ', error);
  }
};

export const deleteEmployeeData = async (id) => {
  try {
    const employeeRef = doc(collection(db, 'employees'), id);
    await deleteDoc(employeeRef);

    showMessage('Данные успешно удалены');

    console.log('Данные успешно удалены.');
  } catch (error) {
    console.error('Ошибка при удалении данных в Firestore: ', error);
  }
};

const getEmployeesDetails = async (id) => {
  try {
    const employeesCollectionRef = collection(db, 'employees');
    const employeesDocRef = doc(employeesCollectionRef, id);

    const employeesSnapshot = await getDoc(employeesDocRef);

    if (employeesSnapshot.exists()) {
      return employeesSnapshot.data();
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
