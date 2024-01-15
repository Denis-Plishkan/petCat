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
} from '../firebase-Сonfig';

export const displaySkills = (skills) => {
  const skillsList = document.getElementById('skillsList');

  if (skillsList) {
    skillsList.innerHTML = '';

    const skillsPointsList = document.createElement('ul');

    skills.points.forEach((point) => {
      const pointItem = document.createElement('li');
      pointItem.textContent = point;
      skillsPointsList.appendChild(pointItem);
    });

    skillsList.appendChild(skillsPointsList);
  }
};
