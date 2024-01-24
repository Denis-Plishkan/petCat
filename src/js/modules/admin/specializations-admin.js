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

export const getSpecializationsList = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'specializations'));
    const specializationArray = [];

    querySnapshot.forEach((doc) => {
      specializationArray.push(doc.data().title);
    });

    return specializationArray;
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
    return [];
  }
};

// export const updateSpecializationsSection = async (id, employeesData) => {
//   const specializationsContainer = document.getElementById(
//     'specializationsContainer'
//   );
//   const addSpecializationBtn = document.getElementById('addSpecializationBtn');

//   if (specializationsContainer && addSpecializationBtn) {
//     specializationsContainer.innerHTML = '';

//     employeesData.specializations.forEach((specialization) => {
//       const specializationBlock = document.createElement('div');
//       specializationBlock.classList.add('specialization-block');

//       const specializationText = document.createElement('span');
//       specializationText.textContent = specialization;

//       const deleteButton = document.createElement('button');
//       deleteButton.textContent = '❌';
//       deleteButton.addEventListener('click', () => {
//         const confirmation = confirm(
//           'Вы уверены, что хотите удалить эту специализацию?'
//         );
//         if (confirmation) {
//           employeesData.specializations = employeesData.specializations.filter(
//             (spec) => spec !== specialization
//           );
//           updateSpecializationsSection(id, employeesData);
//         }
//       });

//       specializationBlock.appendChild(specializationText);
//       specializationBlock.appendChild(deleteButton);

//       specializationsContainer.appendChild(specializationBlock);
//     });

//     // Добавление специализации
//     addSpecializationBtn.addEventListener('click', async () => {
//       const specializationsList = await getSpecializationsList();

//       const newSpecialization = prompt(
//         'Введите новую специализацию (доступные: ' +
//           specializationsList.join(', ') +
//           '):'
//       );

//       if (!newSpecialization) {
//         return;
//       }
//       if (specializationsList.includes(newSpecialization)) {
//         // Проверка наличия специализации в массиве у врача
//         if (!employeesData.specializations.includes(newSpecialization)) {
//           employeesData.specializations.push(newSpecialization);
//           updateSpecializationsSection(id, employeesData);
//         } else {
//           alert(
//             'Эта специализация уже указана у врача. Введите уникальную специализацию.'
//           );
//         }
//       } else {
//         alert(
//           'Введена недействительная специализация. Пожалуйста, выберите из списка.'
//         );
//       }
//     });
//   }
// };
