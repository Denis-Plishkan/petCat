import { db, collection, getDocs } from '../firebase-config';

const popularServicesWrapper = document.querySelectorAll('.services-swiper');

async function popularServices() {
  const servicesCollection = collection(db, 'services');
  const querySnapshot = await getDocs(servicesCollection);

  querySnapshot.forEach((doc) => {
    const { description, title } = doc.data();

    let template = `
        <div class="swiper-slide">
            <div class="popular-services__card-wrapper">
            <div class="popular-services__card">
            <h4 class="popular-services__card-title">${title}</h4>
            <p>${description}</p>
          </div>
            </div>
          </div>
    
    `;

    popularServicesWrapper.forEach((slide) => {
      slide.insertAdjacentHTML('beforeend', template);
    });
  });
}

popularServices();
