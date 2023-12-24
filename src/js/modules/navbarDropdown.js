function navbarDropdown() {
    const dropdowns = document.querySelectorAll('.navbar-dropdown');
    dropdowns.forEach(dropdown => {
        const item = dropdown.querySelector('.navbar__item-dropdown');
        const text = dropdown.querySelector('.navbar__item-wrapper p');
        const navbarArrow = dropdown.querySelector('.navbar__item-arrow');
        const navbarLine = dropdown.querySelector('.navbar__item-line');
        dropdown.addEventListener('click', () => {
            item.classList.toggle('active');
            navbarArrow.classList.toggle('active');
            navbarLine.classList.toggle('active');
            text.classList.toggle('active');
        })
    })
}
navbarDropdown();