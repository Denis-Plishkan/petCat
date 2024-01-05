import { db, collection, getDocs } from '../firebase-Config';

const recordingWrapper = document.querySelectorAll('.recording-slide');

async function recording() {
  const recordingCollection = collection(db, 'employees');
  const querySnapshot = await getDocs(recordingCollection);

  querySnapshot.forEach((doc) => {
    const { img, position, full_name} = doc.data();

    let template = `
    <div class="swiper-slide">
        <div class="recording__cards">
            <div class="specialists-card">
                <div class="specialists-card__photo">
                    <picture>
                        <source srcset="${img.webP}" type="image/webp">
                        <img src="${img.default}" alt="photo">
                    </picture>
                 </div>
                <h5 class="specialists-card__name">${full_name}</h5>
                <p class="specialists-card__job-title">
                    ${position}
                 </p>
            </div>
        </div>
    </div>
    
    `;

    recordingWrapper.forEach((slide) => {
      slide.insertAdjacentHTML('beforeend', template);
      
    });
  });
}

recording();