import { db, collection, getDocs } from '../firebase-Config';

const servicesWrapper = document.querySelectorAll(
  '.all-services__services-wrapper'
);

async function allServices() {
  const allServicesCollection = collection(db, 'services');
  const querySnapshot = await getDocs(allServicesCollection);

  querySnapshot.forEach((doc) => {
    const { title } = doc.data();

    let template = `
        <a href="#">${title}</a>
    `;

    servicesWrapper.forEach((slide) => {
      slide.insertAdjacentHTML('beforeend', template);
    });
  });
}

allServices();
