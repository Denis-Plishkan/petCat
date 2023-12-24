
function thisTab() {
    const elements = document.querySelectorAll('.this__wrapper-left-line');
    elements.forEach((element) => {
      element.addEventListener('click', () => {
        const greenLine = element.querySelector('.this__line_green');
        const greyLine = element.querySelector('.this__line_grey');

        const elementActive = document.querySelector('.this__line_green.active');

        document.querySelectorAll('.this__line_green.active').forEach((el) => {
          el.classList.remove('active');
        });
  
        document.querySelectorAll('.this__line_grey.active').forEach((el) => {
          el.classList.remove('active');
        });
  
        if (!elementActive || !greenLine.classList.contains('active')) {
          greenLine.classList.add('active');
          greyLine.classList.add('active');
        }
      });
    });
  }
  
  thisTab();
