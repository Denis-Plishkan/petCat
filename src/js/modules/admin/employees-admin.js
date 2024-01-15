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

// import { displaySkills } from './skills';

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
      education: education.value,
      skills: skills.value,
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
            <div class="form-group" data-select2-id="48">
            <label>Специализации:</label>
            <select class="select2bs4 select2-hidden-accessible" multiple="" data-placeholder="Выбирете специализацию:" style="width: 100%;" data-select2-id="23" tabindex="-1" aria-hidden="true">
              <option data-select2-id="39">Alabama</option>
              <option data-select2-id="40">Alaska</option>
              <option data-select2-id="41">California</option>
      
            </select>
            <span class="select2 select2-container select2-container--bootstrap4 select2-container--below" dir="ltr" data-select2-id="24" style="width: 100%;">
              <span class="selection">
                <span class="select2-selection select2-selection--multiple" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="-1" aria-disabled="false">
                  <ul class="select2-selection__rendered">
                    <li class="select2-search select2-search--inline">
                      <input class="select2-search__field" type="search" tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" placeholder="Выбирете специализацию" style="width: 576.5px;">
                    </li>
                  </ul>
                </span>
              </span>
              <span class="dropdown-wrapper" aria-hidden="true"></span>
            </span>
          </div>
          <div class="s2-example">
          <p>
            <select class="js-example-basic-multiple js-states form-control select2-hidden-accessible" multiple="" data-select2-id="select2-data-61-pgbf" tabindex="-1" aria-hidden="true">
          <optgroup label="Alaskan/Hawaiian Time Zone" data-select2-id="select2-data-64-jtz1">
            <option value="AK" data-select2-id="select2-data-65-dgzl">Alaska</option>
            <option value="HI" data-select2-id="select2-data-66-zdss">Hawaii</option>
          </optgroup>
          <optgroup label="Pacific Time Zone" data-select2-id="select2-data-67-oy7v">
            <option value="CA" data-select2-id="select2-data-68-gl4s">California</option>
            <option value="NV" data-select2-id="select2-data-69-c555">Nevada</option>
            <option value="OR" data-select2-id="select2-data-70-gn07">Oregon</option>
            <option value="WA" data-select2-id="select2-data-71-ow3b">Washington</option>
          </optgroup>
          <optgroup label="Mountain Time Zone" data-select2-id="select2-data-72-j4vo">
            <option value="AZ" data-select2-id="select2-data-73-aiin">Arizona</option>
            <option value="CO" data-select2-id="select2-data-74-z9on">Colorado</option>
            <option value="ID" data-select2-id="select2-data-75-vr30">Idaho</option>
            <option value="MT" data-select2-id="select2-data-76-latz">Montana</option>
            <option value="NE" data-select2-id="select2-data-77-jomo">Nebraska</option>
            <option value="NM" data-select2-id="select2-data-78-09q8">New Mexico</option>
            <option value="ND" data-select2-id="select2-data-79-tk5h">North Dakota</option>
            <option value="UT" data-select2-id="select2-data-80-mmjz">Utah</option>
            <option value="WY" data-select2-id="select2-data-81-6fxi">Wyoming</option>
          </optgroup>
          <optgroup label="Central Time Zone" data-select2-id="select2-data-82-jqmo">
            <option value="AL" data-select2-id="select2-data-83-aaev">Alabama</option>
            <option value="AR" data-select2-id="select2-data-84-0o0i">Arkansas</option>
            <option value="IL" data-select2-id="select2-data-85-62yf">Illinois</option>
            <option value="IA" data-select2-id="select2-data-86-v8iq">Iowa</option>
            <option value="KS" data-select2-id="select2-data-87-yj7i">Kansas</option>
            <option value="KY" data-select2-id="select2-data-88-ovsg">Kentucky</option>
            <option value="LA" data-select2-id="select2-data-89-j9q0">Louisiana</option>
            <option value="MN" data-select2-id="select2-data-90-w2yy">Minnesota</option>
            <option value="MS" data-select2-id="select2-data-91-9ynw">Mississippi</option>
            <option value="MO" data-select2-id="select2-data-92-xi9v">Missouri</option>
            <option value="OK" data-select2-id="select2-data-93-8og5">Oklahoma</option>
            <option value="SD" data-select2-id="select2-data-94-63c9">South Dakota</option>
            <option value="TX" data-select2-id="select2-data-95-0544">Texas</option>
            <option value="TN" data-select2-id="select2-data-96-0fqo">Tennessee</option>
            <option value="WI" data-select2-id="select2-data-97-w81x">Wisconsin</option>
          </optgroup>
          <optgroup label="Eastern Time Zone" data-select2-id="select2-data-98-yb0f">
            <option value="CT" data-select2-id="select2-data-99-0keg">Connecticut</option>
            <option value="DE" data-select2-id="select2-data-100-c3sw">Delaware</option>
            <option value="FL" data-select2-id="select2-data-101-42ss">Florida</option>
            <option value="GA" data-select2-id="select2-data-102-307j">Georgia</option>
            <option value="IN" data-select2-id="select2-data-103-cca4">Indiana</option>
            <option value="ME" data-select2-id="select2-data-104-f2qc">Maine</option>
            <option value="MD" data-select2-id="select2-data-105-u0gj">Maryland</option>
            <option value="MA" data-select2-id="select2-data-106-eoxa">Massachusetts</option>
            <option value="MI" data-select2-id="select2-data-107-9796">Michigan</option>
            <option value="NH" data-select2-id="select2-data-108-qapa">New Hampshire</option>
            <option value="NJ" data-select2-id="select2-data-109-e3c8">New Jersey</option>
            <option value="NY" data-select2-id="select2-data-110-fr0q">New York</option>
            <option value="NC" data-select2-id="select2-data-111-rvmy">North Carolina</option>
            <option value="OH" data-select2-id="select2-data-112-subh">Ohio</option>
            <option value="PA" data-select2-id="select2-data-113-jpgh">Pennsylvania</option>
            <option value="RI" data-select2-id="select2-data-114-wdc6">Rhode Island</option>
            <option value="SC" data-select2-id="select2-data-115-j8ug">South Carolina</option>
            <option value="VT" data-select2-id="select2-data-116-ruth">Vermont</option>
            <option value="VA" data-select2-id="select2-data-117-0f4a">Virginia</option>
            <option value="WV" data-select2-id="select2-data-118-rdab">West Virginia</option>
          </optgroup>
        </select><span class="select2 select2-container select2-container--default select2-container--focus select2-container--below" dir="ltr" data-select2-id="select2-data-62-8s0t" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--multiple" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="-1" aria-disabled="false"><ul class="select2-selection__rendered" id="select2-3qlw-container"></ul><span class="select2-search select2-search--inline"><textarea class="select2-search__field" type="search" tabindex="0" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" autocomplete="off" aria-label="Search" aria-describedby="select2-3qlw-container" placeholder="" style="width: 0.75em;"></textarea></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
          </p>
        </div>
          
            <div class="employees__wrapper-subtitle">
            <h3>Специализации:</h3>
            <div id="specializationsContainer"></div>
            <button id="addSpecializationBtn">Добавить специализацию</button>
          </div>
          <div class="employees__wrapper-subtitle">
          <h3>${employeesData.skills.title}:</h3>
          <ul id="skillsList"></ul>
          </div> 
            <div  class="ava flex mt-3">
            <h2 data-v-fee137ad="">
            Фотография работника:
            </h2>
            <div data-v-fee137ad="" class="img">
            <img data-v-fee137ad="" src="${employeesData.img.default}" alt="">
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
      // console.log('Навыки сотрудника:', employeesData.skills);

      // displaySkills(employeesData.skills);

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
        ///символы для текста (подумать какое значение установить)
        limitTextLength(serviceTextElement, 500);
      });

      const updateEmployeesBtn = document.getElementById('updateEmployeesBtn');
      updateEmployeesBtn.addEventListener('click', async () => {
        const updatedFullName =
          document.getElementById('employeesName').innerText;
        const updatedPosition =
          document.getElementById('employeesPosition').innerText;

        const fileInput = document.getElementById('img-top');
        const file = fileInput.files[0];
        const img = employeesData.img || {};

        if (file) {
          const storageRef = ref(storage, file.name);
          await uploadBytes(storageRef, file);
          img.default = await getDownloadURL(storageRef);
        }
        const updatedSpecializations = employeesData.specializations;
        await updateEmployeesData(
          id,
          updatedFullName,
          updatedPosition,
          updatedSpecializations,
          {
            img,
          }
        );
        window.location.reload();
        await updateEmployeesData(id, employeesData);
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

      updateSpecializationsSection(id, employeesData);
    }
  } catch (error) {
    console.error('Ошибка при получении данных из Firestore: ', error);
  }
};

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
  updatedSpecializations,
  updatedImg
) => {
  try {
    const employeeRef = doc(collection(db, 'employees'), id);

    const updateData = {
      full_name: updatedFullName,
      position: updatedPosition,
      specializations: updatedSpecializations,
      img: updatedImg.img,
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
