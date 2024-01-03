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

    showMessage('Карточка работника успешно создана');
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

export const displayEmployeesPage = async (id) => {
  try {
    const employeesData = await getEmployeesDetails(id);

    if (employeesData) {
      const contentElement = document.getElementById('app');

      contentElement.innerHTML = `
        <div class="content">
          <div class="employees-details">
            <h2 class="popular-services__wrapper-title">
              <span contenteditable="true" id="employeesName">${employeesData.full_name}</span>
            </h2>
            <div class="popular-services__wrapper-subtitle">
              <h3>Должность:</h3>
              <p contenteditable="true" id="employeesPosition">${employeesData.position}</p>
            </div>
            <div  class="ava flex mt-3">
            <h2 data-v-fee137ad="">
            Фотография работника:
            </h2>
            <div data-v-fee137ad="" class="img">
            <img data-v-fee137ad="" src="${employeesData.imageUrl}" alt="">
            </div>
            <div data-v-fee137ad="" class="add">
            <label data-v-fee137ad="" for="img-top">Загрузить новое фото:</label>
            <input data-v-fee137ad="" class="img-top-input" id="img-top" type="file" accept="image/* ">
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

      const updateEmployeesBtn = document.getElementById('updateEmployeesBtn');
      updateEmployeesBtn.addEventListener('click', async () => {
        const updatedFullName =
          document.getElementById('employeesName').innerText;
        const updatedPosition =
          document.getElementById('employeesPosition').innerText;

        const fileInput = document.getElementById('img-top');
        const file = fileInput.files[0];

        let imageUrl = employeesData.imageUrl;

        if (file) {
          const storageRef = ref(storage, file.name);
          await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(storageRef);
        }

        await updateEmployeesData(
          id,
          updatedFullName,
          updatedPosition,
          imageUrl
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
    } else {
      console.error('Документ с указанным идентификатором не найден.');
    }
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
  }
};

// updatedSpecializations,
// updatedEducation,
// updatedSkills,
// updatedImageUrl
// specializations: updatedSpecializations,
// education: updatedEducation,
// skills: updatedSkills,
export const updateEmployeesData = async (
  id,
  updatedFullName,
  updatedPosition,
  updatedImageUrl
) => {
  try {
    const employeeRef = doc(collection(db, 'employees'), id);

    const updateData = {
      full_name: updatedFullName,
      position: updatedPosition,

      imageUrl: updatedImageUrl,
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
