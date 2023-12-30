function stickyHeader() {
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {

    if (window.scrollY > 0) {
      header.classList.add('header-scroll');
    } else {
      header.classList.remove('header-scroll');
    }
  });

  const input = document.querySelector('.header__top-search-wrapper input');
  input.addEventListener('input', (e) => {
    let inputValue = e.target.value;
    if (inputValue.length !== 0) {
        header.classList.remove('header-scroll');
    } else {
        header.classList.add('header-scroll');
    }
  });
}

stickyHeader();
