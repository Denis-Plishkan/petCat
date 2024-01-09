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
} from '../firebase-Config';

export const displaySkills = (skillsData) => {
  const skillsList = document.getElementById('skillsList');
  skillsList.innerHTML = '';

  if (
    skillsData.skills &&
    skillsData.skills.points &&
    skillsData.skills.points.length > 0
  ) {
    const skillsItems = skillsData.skills.points.map(
      (skill) => `<li>${skill}</li>`
    );

    skillsList.innerHTML += '<ul>' + skillsItems.join('') + '</ul>';
  } else {
    skillsList.textContent = 'Нет данных о навыках';
  }
};
{
  /* <div class="employees__wrapper-subtitle">
<h3>${employeesData.skills.title}:</h3>
<ul id="skillsList"></ul>
</div> */
}
