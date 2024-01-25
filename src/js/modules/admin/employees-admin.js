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
import { getSpecializationsList } from './specializations-admin';

import { displaySkills } from './skills';

import { getPositionList } from './position-admin';

import { displayEducation } from './education-form';

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
    cardSpecializations.textContent = `Должность: ${data.specializations.join(
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

  const educationContainer = document.getElementById('educationContainer');
  const addDiplomaBtn = document.getElementById('addDiplomaBtn');
  const addOthersBtn = document.getElementById('addOthersBtn');

  if (educationContainer && addDiplomaBtn && addOthersBtn) {
    educationContainer.innerHTML = '';
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

  const skillsContainer = document.getElementById('skillsContainer');
  const skillInputs = skillsContainer.querySelectorAll('.point-input');
  const skillsPoints = Array.from(skillInputs).map((input) => input.value);

  const skills = {
    points: skillsPoints,
  };

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
      skills: skills,
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
    previewImage.src = ``;
  }
}

const createSkillInput = (value) => {
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Проф. навык';
  input.value = value || '';
  input.classList.add('point-input');

  const skillContainer = document.createElement('div');
  skillContainer.classList.add('skill-container');
  skillContainer.appendChild(input);

  const removeSkillPointBtn = document.createElement('button');
  removeSkillPointBtn.textContent = 'Удалить навык';
  removeSkillPointBtn.addEventListener('click', () =>
    removeSkillPointBtnHandler(skillContainer)
  );
  skillContainer.appendChild(removeSkillPointBtn);

  return skillContainer;
};

const removeSkillPointBtnHandler = (skillContainer) => {
  const skillsContainer = document.getElementById('skillsContainer');
  skillsContainer.removeChild(skillContainer);
};

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

    const positionSelect = document.getElementById('position');

    if (submitEmployesBtn && positionSelect) {
      submitEmployesBtn.addEventListener('click', submitEmployesBtnHandler);

      const position = await getPositionList();

      positionSelect.innerHTML = '';

      position.forEach((position) => {
        const option = document.createElement('option');
        option.value = position;
        option.text = position;
        positionSelect.add(option);
      });
    }

    const addSkillPointBtn = document.getElementById('addSkillPointBtn');
    if (addSkillPointBtn) {
      addSkillPointBtn.addEventListener('click', () => {
        const skillsContainer = document.getElementById('skillsContainer');
        const input = createSkillInput('');
        skillsContainer.appendChild(input);
      });
    }

    const removeSkillPointBtn = document.getElementById('removeSkillPointBtn');
    if (removeSkillPointBtn) {
      removeSkillPointBtn.addEventListener('click', () => {
        const skillsContainer = document.getElementById('skillsContainer');
        const skillInputs = skillsContainer.querySelectorAll('.point-input');
        if (skillInputs.length > 1) {
          const lastSkillInput = skillInputs[skillInputs.length - 1];
          skillsContainer.removeChild(lastSkillInput.parentElement);
        }
      });
    }
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

  const addDiplomaBtn = document.getElementById('addDiplomaBtn');
  if (addDiplomaBtn) {
    addDiplomaBtn.addEventListener('click', () => {
      const educationContainer = document.getElementById('educationContainer');
      const diplomaContainer = createDiplomaContainer();
      educationContainer.appendChild(diplomaContainer);
    });
  }

  const addOthersBtn = document.getElementById('addOthersBtn');
  if (addOthersBtn) {
    addOthersBtn.addEventListener('click', () => {
      const educationContainer = document.getElementById('educationContainer');
      const othersContainer = createOthersContainer();
      educationContainer.appendChild(othersContainer);
    });
  }

  const educationContainer = document.getElementById('educationContainer');
  if (educationContainer) {
    educationContainer.addEventListener('click', (event) => {
      const target = event.target;
      if (target.classList.contains('delete-education-btn')) {
        const educationItem = target.closest('.education-list__item');
        if (educationItem) {
          educationContainer.removeChild(educationItem);
        }
      }
    });
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
              <select id="position" style="width: 300px;"></select>

            </div>
     
            <div class="employees__wrapper-subtitle">
            <h3>Специализации:</h3>
       
            <select id="specializations" style="width: 300px;"></select>
          </div>
          <div class="employees__wrapper-subtitle">
          <h3>Профессиональные навыки:</h3>
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
      <div class="employees__wrapper-subtitle" id="educationContainer">
      <h3>Образование:</h3>

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
      displayEducation(employeesData.education);

      const addSkillBtn = document.getElementById('addSkillBtn');

      const imgTopInput = document.getElementById('img-top');
      if (imgTopInput) {
        imgTopInput.addEventListener('change', previewImage);
      }

      const employeesNameElement = document.getElementById('employeesName');

      const positionSelect = $('#position');
      const specializationsSelect = $('#specializations');

      positionSelect.val(null).trigger('change');
      specializationsSelect.val(null).trigger('change');
      specializationsSelect.select2({
        multiple: true,
      });

      const positions = await getPositionList();
      positions.forEach((position) => {
        const option = new Option(
          position,
          position,
          position === employeesData.position,
          position === employeesData.position
        );
        positionSelect.append(option).trigger('change');
      });

      const specializations = await getSpecializationsList();
      specializations.forEach((specialization) => {
        const isSelected =
          employeesData.specializations &&
          employeesData.specializations.includes(specialization);
        const option = new Option(
          specialization,
          specialization,
          isSelected,
          isSelected
        );
        specializationsSelect.append(option).trigger('change');
      });

      employeesNameElement.addEventListener('input', () => {
        limitTextLength(employeesNameElement, 70);
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

      //кнопки
      const updateEmployeesBtn = document.getElementById('updateEmployeesBtn');
      updateEmployeesBtn.addEventListener('click', async () => {
        const updatedFullName =
          document.getElementById('employeesName').innerText;
        const updatedPositionSelect = document.getElementById('position');
        const updatedPosition = updatedPositionSelect.value;

        const updatedSpecializationsSelect =
          document.getElementById('specializations');
        const updatedSpecializations = Array.from(
          updatedSpecializationsSelect.selectedOptions
        ).map((option) => option.value);

        const updatedSkillsPoints = [];
        const pointInputs = document.querySelectorAll('.point-input');
        pointInputs.forEach((input) => {
          updatedSkillsPoints.push(input.value);
        });
        const updatedEducation = {
          diplomas: collectEducationData('diplomas'),
          others: collectEducationData('others'),
        };

        const fileInput = document.getElementById('img-top');
        const file = fileInput.files[0];
        const updatedImg = employeesData.img || {};

        if (file) {
          const storageRef = ref(storage, file.name);
          await uploadBytes(storageRef, file);
          updatedImg.default = await getDownloadURL(storageRef);
        }

        await updateEmployeesData(
          id,
          updatedFullName,
          updatedPosition,
          updatedSpecializations,
          { points: updatedSkillsPoints },
          { default: updatedImg.default },
          updatedEducation
        );

        window.location.reload();
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
    }
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
  }
};

const collectEducationData = (type) => {
  const educationList = document.getElementById(`${type}List`);
  const educationItems = educationList ? educationList.children : [];

  const educationData = [];

  for (let i = 0; i < educationItems.length; i++) {
    const educationItem = educationItems[i];
    const placeInput = educationItem.querySelector('.place-input');
    const yearInput = educationItem.querySelector('.year-input');

    educationData.push({
      place: placeInput ? placeInput.value : '',
      year: yearInput ? yearInput.value : '',
    });
  }

  return educationData;
};

export const updateEmployeesData = async (
  id,
  updatedFullName,
  updatedPosition,
  updatedSpecializations,
  updatedSkills,
  updatedImg,
  updatedEducation
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
      education: updatedEducation,
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
// Добавляем обработчик для кнопки "Добавить диплом"
const addDiplomaBtn = document.getElementById('addDiplomaBtn');
if (addDiplomaBtn) {
  addDiplomaBtn.addEventListener('click', () => {
    const educationContainer = document.getElementById('educationContainer');
    const diplomaContainer = createDiplomaContainer();
    educationContainer.appendChild(diplomaContainer);
  });
}

// Добавляем обработчик для кнопки "Добавить другое образование"
const addOthersBtn = document.getElementById('addOthersBtn');
if (addOthersBtn) {
  addOthersBtn.addEventListener('click', () => {
    const educationContainer = document.getElementById('educationContainer');
    const othersContainer = createOthersContainer();
    educationContainer.appendChild(othersContainer);
  });
}

// Добавляем обработчик для кнопки "Удалить образование"
const educationContainer = document.getElementById('educationContainer');
if (educationContainer) {
  educationContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('delete-education-btn')) {
      const educationItem = target.closest('.education-list__item');
      if (educationItem) {
        educationContainer.removeChild(educationItem);
      }
    }
  });
}

// Функция для создания контейнера диплома
const createDiplomaContainer = () => {
  const diplomaContainer = document.createElement('div');
  diplomaContainer.classList.add(
    'education-list__item',
    'diploma-container',
    'education-container'
  );

  diplomaContainer.innerHTML = `
        <div class="mt-3">
            <label for="education">Год окончания: </label>
            <input class="diploma-year-input" type="text" placeholder="Год окончания" style="width: 10%" />
            <label for="diplomaPlace">Место окончания: </label>
            <input class="diploma-place-input" type="text" placeholder="информация" style="width: 50%" />
            <button class="delete-education-btn">Удалить</button>
        </div>
    `;

  return diplomaContainer;
};

// Функция для создания контейнера другого образования
const createOthersContainer = () => {
  const othersContainer = document.createElement('div');
  othersContainer.classList.add(
    'education-list__item',
    'others-container',
    'education-container'
  );

  othersContainer.innerHTML = `
        <div class="mt-3">
            <label for="education">Год окончания: </label>
            <input class="others-year-input" type="text" placeholder="Год окончания" style="width: 10%" />
            <label for="othersPlace">Место окончания: </label>
            <input class="others-place-input" type="text" placeholder="информация" style="width: 50%" />
            <button class="delete-education-btn">Удалить</button>
        </div>
    `;

  return othersContainer;
};
