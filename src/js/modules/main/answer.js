import { db, collection, getDocs } from '../firebase-config';

const answerWrapper = document.querySelectorAll('.answer-slide');

async function answer() {
  const answersCollection = collection(db, 'employees');
  const querySnapshot = await getDocs(answersCollection);

  querySnapshot.forEach((doc) => {
    const { img, position, full_name } = doc.data();

    let template = `
    <div class="swiper-slide">
        <div class="answers__cards">
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

    answerWrapper.forEach((slide) => {
      slide.insertAdjacentHTML('beforeend', template);
    });
  });
}

answer();
