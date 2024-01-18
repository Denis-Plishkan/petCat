function addField(containerClass, fieldClass, removeBtnClass) {
  const educationContainer = document.querySelector(`.${containerClass}`);

  const newField = document.createElement('div');
  newField.classList.add('mt-3');
  newField.classList.add(fieldClass);

  newField.innerHTML = `
      <label for="education">Год окончания:</label>
      <input class="${fieldClass}-year-input" type="text" placeholder="Год окончания" style="width: 10%" />
  
      <label for="${fieldClass}Place">Место окончания:</label>
      <input class="${fieldClass}-place-input" type="text" placeholder="информация" style="width: 50%" />
  
      <button class="${removeBtnClass}" onclick="removeField(this, '${containerClass}')">Удалить поле</button>
  `;

  educationContainer.appendChild(newField);
}

function removeField(button, containerClass) {
  const fieldToRemove = button.parentNode;
  fieldToRemove.parentNode.removeChild(fieldToRemove);
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-diploma-btn')) {
    removeField(event.target, 'diploma-container');
  } else if (event.target.classList.contains('remove-others-btn')) {
    removeField(event.target, 'others-container');
  } else if (event.target.id === 'addDiplomaBtn') {
    addField('diploma-container', 'diploma', 'remove-diploma-btn');
  } else if (event.target.id === 'addOthersBtn') {
    addField('others-container', 'others', 'remove-others-btn');
  }
});

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
