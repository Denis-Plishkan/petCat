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
