import { db, collection, getDocs } from '../firebase-config';

const historyWrapper = document.querySelectorAll('.history-slide');

async function history() {
  const historyCollection = collection(db, 'story');
  const querySnapshot = await getDocs(historyCollection);

  querySnapshot.forEach((doc) => {
    const { img, title, date } = doc.data();

    let template = `
    <div class="swiper-slide ">
            <div class="history__cards">
            <div class="patient-card">
                <div class="patient-card__photo">
                <picture>
                    <source srcset="${img.webP}" type="image/webp">
                    <img src="${img.default}" alt="photo">
                </picture>
                </div>
            <div class="patient-card__wrapper">
                <h5 class="patient-card__disease">
                    ${title}
                </h5>
                <p class="patient-card__data">${date}</p>
            </div>
        </div>
        </div>
        </div>
    
    `;

    historyWrapper.forEach((slide) => {
      slide.insertAdjacentHTML('beforeend', template);
    });
  });
}

history();
