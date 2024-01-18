export const displaySkills = (skillsData) => {
  const skillsListElement = document.getElementById('skillsList');
  const addSkillPointBtnElement = document.getElementById('addSkillPointBtn');

  if (skillsListElement && addSkillPointBtnElement) {
    skillsListElement.innerHTML = '';
    const titleElement = document.createElement('h3');
    titleElement.textContent = skillsData.title || '';
    skillsListElement.appendChild(titleElement);

    const pointsList = document.createElement('ul');
    pointsList.id = 'pointsList';
    pointsList.classList.add('skills-list');

    if (skillsData.points && skillsData.points.length > 0) {
      skillsData.points.forEach((point, index) => {
        const pointItem = createSkillPointItem(point, index);
        pointItem.classList.add('skills-list__link');
        pointsList.appendChild(pointItem);
      });
    }

    skillsListElement.appendChild(pointsList);

    addSkillPointBtnElement.addEventListener('click', () => {
      const newSkillPointItem = createSkillPointItem(
        '',
        pointsList.children.length
      );
      newSkillPointItem.classList.add('skills-list__link');
      pointsList.appendChild(newSkillPointItem);
    });
  }
};

const createSkillPointItem = (pointValue, index) => {
  const pointItem = document.createElement('li');
  pointItem.innerHTML = `
    <input type="text" class="point-input" placeholder="Введите текст" value="${pointValue}">
    <button class="delete-point-btn" data-index="${index}">Удалить</button>
  `;

  const skillPointInput = pointItem.querySelector('.point-input');
  if (skillPointInput) {
    skillPointInput.addEventListener('input', () => {
      const maxLength = 300;
      if (skillPointInput.value.length > maxLength) {
        skillPointInput.value = skillPointInput.value.slice(0, maxLength);
      }
    });
  }

  const deletePointBtn = pointItem.querySelector('.delete-point-btn');
  if (deletePointBtn) {
    deletePointBtn.addEventListener('click', () => {
      pointItem.remove();
    });
  }

  return pointItem;
};
