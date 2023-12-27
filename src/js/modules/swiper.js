import Swiper, { Navigation, Pagination, Autoplay, Scrollbar } from 'swiper';
Swiper.use([Navigation, Pagination, Autoplay, Scrollbar]);

function popularCervisesSwiper() {
  let swiper = new Swiper('.popular-services-swiper', {
    slidesPerView: 'auto',
    speed: 1100,
    navigation: {
      nextEl: '.popular-services__swiper-button-next',
      prevEl: '.popular-services__swiper-button-prev',
    },
  });
}
popularCervisesSwiper();

function answersSwiper() {
  let swiper = new Swiper('.answers-swiper', {
    slidesPerView: 'auto',
    speed: 1100,
    navigation: {
      nextEl: '.answers__swiper-button-next',
      prevEl: '.answers__swiper-button-prev',
    },
  });
}
answersSwiper();

function historySwiper() {
  let swiper = new Swiper('.history-swiper', {
    slidesPerView: 'auto',
    speed: 1100,
    navigation: {
      nextEl: '.history__swiper-button-next',
      prevEl: '.history__swiper-button-prev',
    },
  });
}
historySwiper();

