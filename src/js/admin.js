import { collection, addDoc, getDocs } from 'firebase/firestore/lite';
import { db, storage, ref, uploadBytes } from './modules/firebase-Config';

// document
//   .getElementById('submitBtn')
//   .addEventListener('click', async function () {
//     const titleInput = document.getElementById('title');
//     const descriptionInput = document.getElementById('desctiption');
//     const errorText = document.getElementById('errorText');

//     errorText.textContent = '';

//     if (!titleInput.value || !descriptionInput.value) {
//       errorText.textContent =
//         'Ошибка: Поля "Названиe" и "Описание" обязательны для заполнения.';
//       return;
//     }

//     const fileInput = document.getElementById('img-for-page');
//     const file = fileInput.files[0];
//     let imageUrl = '';

//     if (file) {
//       try {
//         const storageRef = storage.ref();
//         const fileRef = storageRef.child(file.name);
//         await fileRef.put(file);

//         imageUrl = await fileRef.getDownloadURL();
//         console.log('URL фотографии:', imageUrl);
//       } catch (e) {
//         console.error(
//           'Ошибка при загрузке файла или получении URL: ',
//           e.message,
//           e.code
//         );
//         return;
//       }
//     }

//     try {
//       const docRef = await addDoc(collection(db, 'services'), {
//         title: titleInput.value,
//         description: descriptionInput.value,
//         imageUrl: imageUrl,
//       });

//       console.log('Документ успешно добавлен с ID: ', docRef.id);

//       titleInput.value = '';
//       descriptionInput.value = '';

//       document.getElementById('submitBtn').setAttribute('disabled', 'true');

//       // window.location.reload();
//     } catch (e) {
//       console.error('Ошибка при добавлении документа: ', e.message, e.code);
//     }
//   });

////////////////статистика
document.addEventListener('DOMContentLoaded', async function () {
  let userCounter = 0;
  async function usersCount() {
    const usersCollection = collection(db, 'users');

    try {
      const querySnapshot = await getDocs(usersCollection);
      const userCount = querySnapshot.size;
      userCounter = querySnapshot.size;
      console.log(`Количество пользователей: ${userCount}`);
      console.log(typeof userCount);
      return userCount;
    } catch (error) {
      console.error('Ошибка при получении количества пользователей:', error);
      return '?';
    }
  }

  await usersCount();

  const contentWrapper = document.querySelector('.content-wrapper');
  const links = document.querySelectorAll('.nav-link');

  links.forEach((link) => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const dataId = link.getAttribute('data-id');
      loadContent(dataId);
    });
  });

  const reviewsCount = 65;
  contentWrapper.innerHTML = `
      <div class="content-header" >
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Статистика</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Dashboard v1</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <section class="content">
      <div class="container-fluid">
      <div class="row">
        <div class="col-lg-3 col-6">
          <div class="small-box bg-warning">
            <div class="inner" id="totalUsers">
              <h3>${userCounter}</h3>
              <p>Пользователей зарегистрировано</p>
            </div>
            <div class="icon">
              <i class="ion ion-person-add"></i>
            </div>
            <a href="#" class="small-box-footer">
              More info <i class="fas fa-arrow-circle-right"></i>
            </a>
          </div>
        </div>
        <div class="col-lg-3 col-6">
        <div class="small-box bg-danger">
          <div class="inner">
            <h3>${reviewsCount}</h3>

            <p>Оставлено отзывов</p>
          </div>
          <div class="icon">
            <i class="ion ion-pie-graph"></i>
          </div>
          <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
      </div>
      </div>
      <div class="map">
        <div class="card bg-gradient-primary">
          <div class="card-header border-0">
            <h3 class="card-title">
              <span class="iconify map-marker" data-icon="clarity:map-marker-line"></span>
              Пользователи
            </h3>
          </div>
          <div class="card-body">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d45522840.46497562!2d61.62450108398035!3d45.861431751010976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sua!4v1634672777981!5m2!1sru!2sua"
              width="100%"
              height="400px"
              allowfullscreen=""
              loading="lazy"
              style="border: 0px"
            ></iframe>
          </div>
        </div>
      </div>
      </div>
      </section>
    `;
});