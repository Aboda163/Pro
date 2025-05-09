// menu.js
// Handles menu item selection, cart management, and checkout logic

// Fetch cart from localStorage or initialize as empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart counter on all pages
function updateCartCounter() {
    const counterEls = document.querySelectorAll('.cart-counter');
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    counterEls.forEach(el => el.textContent = count);
}

// Add item to cart
function addToCart(item) {
    const existingItem = cart.find(i => i.name === item.name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
    alert(`${item.name} added to cart.`);
}

// Setup menu page handlers
function setupMenu() {
    const productCards = document.querySelectorAll(".product_items");
    productCards.forEach(card => {
        const name = card.querySelector("h2").innerText.trim();
        const priceText = card.querySelector("p:nth-of-type(3)").innerText;
        const price = parseFloat(priceText.replace("Price", "").replace("EG", "").trim());
        const imgSrc = card.querySelector("img").src;

        const addBtn = card.querySelector("a");
        addBtn.addEventListener("click", (e) => {
            e.preventDefault();
            addToCart({ name, price, imgSrc });
        });
    });
}

// Render cart page
function renderCartPage() {
    const container = document.querySelector(".cart-content");
    const subtotalEl = document.querySelector(".subtotal-price");
    const totalEl = document.querySelector(".total-price");

    if (!container) return;

    container.innerHTML = "";
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;

        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">${item.price} EG x ${item.quantity}</p>
            </div>
            <button class="remove-item">Remove</button>
        `;
        
        itemEl.querySelector(".remove-item").addEventListener("click", () => {
            removeFromCart(item.name);
            renderCartPage();
        });

        container.appendChild(itemEl);
    });

    subtotalEl.textContent = `${subtotal.toFixed(2)} EG`;
    totalEl.textContent = `${subtotal.toFixed(2)} EG`;
}

// Remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
}

// Handle checkout
function handleCheckout() {
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (!checkoutBtn) return;
    
    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        alert("Order placed successfully! Thank you.");
        cart = [];
        localStorage.removeItem("cart");
        renderCartPage();
        updateCartCounter();
    });
}

// Initialize based on current page
window.addEventListener("DOMContentLoaded", () => {
    updateCartCounter();
    setupMenu();
    renderCartPage();
    handleCheckout();
});
