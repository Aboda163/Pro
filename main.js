// main.js for homepage.html

// Fade-in effect for the hero text
document.addEventListener('DOMContentLoaded', function () {
    const heroText = document.querySelector('.descr');
    if (heroText) {
        heroText.style.opacity = '0';
        setTimeout(() => {
            heroText.style.transition = 'opacity 1s ease-in';
            heroText.style.opacity = '1';
        }, 300);
    }
});

// Redirect "Products" button to menu.html
const productsButton = document.querySelector('.buttons .button_product a');
if (productsButton) {
    productsButton.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'menu.html';
    });
}

// Sticky navbar on scroll
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.position = 'fixed';
            navbar.style.top = '0';
            navbar.style.width = '100%';
            navbar.style.background = 'rgba(78, 31, 0, 0.9)'; // Matches Cart.css navbar color
            navbar.style.zIndex = '1000';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.position = 'relative';
            navbar.style.background = ''; // Reset to original
            navbar.style.boxShadow = '';
        }
    }
});