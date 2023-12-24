import Swiper, { Navigation, Pagination, Autoplay, Scrollbar } from 'swiper';
Swiper.use([Navigation, Pagination, Autoplay, Scrollbar]);

function popularCervisesSwiper() {
  let swiper = new Swiper('.popular-services-swiper', {
    slidesPerView: 'auto',
    speed: 1100,
    // pagination: {
    //   el: '.stock__swiper-pagination',
    // },
    navigation: {
      nextEl: '.popular-services__swiper-button-next',
      prevEl: '.popular-services__swiper-button-prev',
    },
  });
}
popularCervisesSwiper();

