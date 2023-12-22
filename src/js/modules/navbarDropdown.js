function navbarDropdown() {
    const dropdowns = document.querySelectorAll('.navbar-dropdown');
    dropdowns.forEach(dropdown => {
        const item = dropdown.querySelector('.navbar__item-dropdown');
        const arrow = dropdown.querySelector('.navbar__item-wrapper svg');
        dropdown.addEventListener('click', () => {
            item.classList.toggle('active');
            arrow.classList.toggle('active');
            
        })
    })
}
navbarDropdown();