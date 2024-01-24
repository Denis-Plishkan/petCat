export const displayEducation = (educationData) => {
  const educationContainer = document.getElementById('educationContainer');

  if (educationContainer) {
    educationContainer.innerHTML = '';

    createEducationList('diplomas', 'Дипломы', educationData.diplomas);
    createEducationList('others', 'Другое образование', educationData.others);
  }
};

const createEducationList = (type, label, items) => {
  const educationContainer = document.getElementById('educationContainer');
  const educationList = document.createElement('ul');
  educationList.id = `${type}List`;
  educationList.classList.add('education-list');

  const educationTitle = document.createElement('h3');
  educationTitle.textContent = label;
  educationContainer.appendChild(educationTitle);

  if (items && items.length > 0) {
    items.forEach((item, index) => {
      const educationItem = createEducationItem(item, index, type);
      educationList.appendChild(educationItem);
    });
  }

  educationContainer.appendChild(educationList);

  const addEducationBtn = document.createElement('button');
  addEducationBtn.textContent = `Добавить ${label.toLowerCase()}`;
  addEducationBtn.addEventListener('click', () => addEducationItem(type));
  educationContainer.appendChild(addEducationBtn);
};

const createEducationItem = (educationItem, index, type) => {
  const educationItemElement = document.createElement('li');
  educationItemElement.innerHTML = `
    <div>
      <span class="education-list__label">Информация:</span>
      <input type="text" class="place-input" placeholder="Введите место" value="${
        educationItem.place || ''
      }"maxlength="300">
    </div>
    <div>
      <span class="education-list__label">Год полученя:</span>
      <input type="text" class="year-input" placeholder="Введите год" value="${
        educationItem.year || ''
      }" maxlength="4" pattern="\d{4}">
    </div>
  
    <button class="delete-education-btn" data-index="${index}" data-type="${type}">Удалить</button>
  `;

  return educationItemElement;
};

const addEducationItem = (type) => {
  const educationList = document.getElementById(`${type}List`);
  if (educationList) {
    const newEducationItem = createEducationItem(
      {},
      educationList.children.length,
      type
    );
    educationList.appendChild(newEducationItem);
  }
};

const updateEducationData = (id, updatedEducation) => {
  try {
    const employeeRef = doc(collection(db, 'employees'), id);
    setDoc(employeeRef, { education: updatedEducation }, { merge: true });

    showMessage('Данные об образовании успешно обновлены.');

    console.log('Данные об образовании успешно обновлены.');
  } catch (error) {
    console.error('Ошибка при обновлении данных в Firestore: ', error);
  }
};

const deleteEducationItem = (id, type, index) => {
  try {
    const employeeRef = doc(collection(db, 'employees'), id);
    const field = type === 'diplomas' ? 'diplomas' : 'others';

    const updateData = {
      [field]: arrayRemove(index),
    };

    updateDoc(employeeRef, updateData);

    showMessage('Пункт образования успешно удален.');

    console.log('Пункт образования успешно удален.');
  } catch (error) {
    console.error('Ошибка при удалении пункта образования: ', error);
  }
};

// function addField(containerClass, fieldClass, removeBtnClass) {
//   const educationContainer = document.querySelector(`.${containerClass}`);

//   const newField = document.createElement('div');
//   newField.classList.add('mt-3');
//   newField.classList.add(fieldClass);

//   newField.innerHTML = `
//       <label for="education">Год окончания:</label>
//       <input class="${fieldClass}-year-input" type="text" placeholder="Год окончания" style="width: 10%" />

//       <label for="${fieldClass}Place">Место окончания:</label>
//       <input class="${fieldClass}-place-input" type="text" placeholder="информация" style="width: 50%" />

//       <button class="${removeBtnClass}" onclick="removeField(this, '${containerClass}')">Удалить поле</button>
//   `;

//   educationContainer.appendChild(newField);
// }

// function removeField(button, containerClass) {
//   const fieldToRemove = button.parentNode;
//   fieldToRemove.parentNode.removeChild(fieldToRemove);
// }

// document.addEventListener('click', (event) => {
//   if (event.target.classList.contains('remove-diploma-btn')) {
//     removeField(event.target, 'diploma-container');
//   } else if (event.target.classList.contains('remove-others-btn')) {
//     removeField(event.target, 'others-container');
//   } else if (event.target.id === 'addDiplomaBtn') {
//     addField('diploma-container', 'diploma', 'remove-diploma-btn');
//   } else if (event.target.id === 'addOthersBtn') {
//     addField('others-container', 'others', 'remove-others-btn');
//   }
// });

//  const displayEducation = (container, educationData) => {
//   container.innerHTML = '';

//   if (educationData) {
//     if (educationData.diplomas && educationData.diplomas.length > 0) {
//       educationData.diplomas.forEach((diploma) => {
//         addDiplomaField(container, diploma.year, diploma.place);
//       });
//     }

//     if (educationData.others && educationData.others.length > 0) {
//       educationData.others.forEach((other) => {
//         addOthersField(container, other.year, other.place);
//       });
//     }
//   }
// };

// const getUpdatedEducation = () => {
//   const education = {};

//   const diplomasYearInputs = document.querySelectorAll('.diploma-year-input');
//   const diplomasPlaceInputs = document.querySelectorAll('.diploma-place-input');
//   education.diplomas = getFieldsData(diplomasYearInputs, diplomasPlaceInputs);

//   const othersYearInputs = document.querySelectorAll('.others-year-input');
//   const othersPlaceInputs = document.querySelectorAll('.others-place-input');
//   education.others = getFieldsData(othersYearInputs, othersPlaceInputs);

//   return education;
// };

// const getFieldsData = (yearInputs, placeInputs) => {
//   const data = [];

//   for (let i = 0; i < yearInputs.length; i++) {
//     const year = yearInputs[i].value.trim();
//     const place = placeInputs[i].value.trim();

//     if (year && place) {
//       data.push({
//         year: year,
//         place: place,
//       });
//     }
//   }

//   return data;
// };

// export const displayEducation = (educationData) => {
//   const educationContainer = document.getElementById('educationContainer');

//   if (educationContainer) {
//     educationContainer.innerHTML = '';
//     const diplomasList = document.createElement('ul');
//     diplomasList.id = 'diplomasList';
//     diplomasList.classList.add('education-list');

//     const othersList = document.createElement('ul');
//     othersList.id = 'othersList';
//     othersList.classList.add('education-list');

//     if (educationData.diplomas && educationData.diplomas.length > 0) {
//       educationData.diplomas.forEach((diploma, index) => {
//         const diplomaItem = createEducationItem(diploma, index, 'diplomas');
//         diplomaItem.classList.add('education-list__item');
//         diplomasList.appendChild(diplomaItem);
//       });
//     }

//     if (educationData.others && educationData.others.length > 0) {
//       educationData.others.forEach((other, index) => {
//         const otherItem = createEducationItem(other, index, 'others');
//         otherItem.classList.add('education-list__item');
//         othersList.appendChild(otherItem);
//       });
//     }

//     educationContainer.appendChild(diplomasList);
//     educationContainer.appendChild(othersList);
//   }
// };

// // Функция создания пункта образования
// const createEducationItem = (educationItem, index, type) => {
//   const educationItemElement = document.createElement('li');
//   educationItemElement.innerHTML = `
//     <div>
//       <span class="education-list__label">Место:</span>
//       <input type="text" class="place-input" placeholder="Введите место" value="${
//         educationItem.place || ''
//       }">
//     </div>
//     <div>
//       <span class="education-list__label">Год:</span>
//       <input type="text" class="year-input" placeholder="Введите год" value="${
//         educationItem.year || ''
//       }">
//     </div>
//     <div>
//       <span class="education-list__label">Описание:</span>
//       <textarea class="description-input" placeholder="Введите описание">${
//         educationItem.description || ''
//       }</textarea>
//     </div>
//     <button class="delete-education-btn" data-index="${index}" data-type="${type}">Удалить</button>
//   `;

//   const placeInput = educationItemElement.querySelector('.place-input');
//   const yearInput = educationItemElement.querySelector('.year-input');
//   const descriptionInput =
//     educationItemElement.querySelector('.description-input');
//   const deleteEducationBtn = educationItemElement.querySelector(
//     '.delete-education-btn'
//   );

//   if (placeInput) {
//     placeInput.addEventListener('input', () => {
//       const maxLength = 100;
//       if (placeInput.value.length > maxLength) {
//         placeInput.value = placeInput.value.slice(0, maxLength);
//       }
//     });
//   }

//   if (yearInput) {
//     yearInput.addEventListener('input', () => {
//       const maxLength = 4;
//       if (yearInput.value.length > maxLength) {
//         yearInput.value = yearInput.value.slice(0, maxLength);
//       }
//     });
//   }

//   if (descriptionInput) {
//     descriptionInput.addEventListener('input', () => {
//       const maxLength = 300;
//       if (descriptionInput.value.length > maxLength) {
//         descriptionInput.value = descriptionInput.value.slice(0, maxLength);
//       }
//     });
//   }

//   if (deleteEducationBtn) {
//     deleteEducationBtn.addEventListener('click', () => {
//       educationItemElement.remove();
//     });
//   }

//   return educationItemElement;
// };

// // Функция добавления нового пункта образования
// export const addEducationItem = (type) => {
//   const educationList = document.getElementById(`${type}List`);

//   if (educationList) {
//     const newEducationItem = createEducationItem(
//       {},
//       educationList.children.length,
//       type
//     );
//     newEducationItem.classList.add('education-list__item');
//     educationList.appendChild(newEducationItem);
//   }
// };
