document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart functionality for all pages
    initializeCart();
    
    // Handle menu page additions
    if (document.querySelector('.add-to-cart-btn')) setupAddToCart();
    
    // Handle cart page updates
    if (document.querySelector('.cart-content')) {
        renderCart();
        setupCartInteractions();
        setupCheckout();
    }
});

/* ================= CART CORE FUNCTIONALITY ================= */
function initializeCart() {
    if (!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([]));
    updateCartCounter();
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.querySelectorAll('.cart-counter').forEach(el => el.textContent = totalItems);
}

/* ================= MENU PAGE FUNCTIONALITY ================= */
function setupAddToCart() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = e.target.closest('.product_items');
            const item = {
                name: product.querySelector('h2').textContent,
                price: parseFloat(product.querySelector('p:last-of-type').textContent.match(/\d+/)[0]),
                image: product.querySelector('img').src,
                quantity: 1
            };
            addToCart(item);
            showAddedToast(item.name);
        });
    });
}

function addToCart(newItem) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const existingItem = cart.find(item => item.name === newItem.name);
    
    if (existingItem) existingItem.quantity++;
    else cart.push(newItem);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
}

function showAddedToast(itemName) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.textContent = `✓ Added ${itemName}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

/* ================= CART PAGE FUNCTIONALITY ================= */
function renderCart() {
    const cartContent = document.querySelector('.cart-content');
    const cart = JSON.parse(localStorage.getItem('cart'));
    
    cartContent.innerHTML = cart.length ? 
        cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">${item.price} EG</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remove-btn" data-index="${index}">&times;</button>
            </div>
        `).join('') : 
        '<div class="empty-cart">Your cart is empty. Start adding some delicious items!</div>';
    
    updateSummary();
}

function setupCartInteractions() {
    // Quantity controls
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            const cart = JSON.parse(localStorage.getItem('cart'));
            
            if (e.target.classList.contains('plus')) cart[index].quantity++;
            if (e.target.classList.contains('minus')) cart[index].quantity = Math.max(1, cart[index].quantity - 1);
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCounter();
            updateSummary();
            e.target.parentNode.querySelector('.quantity-input').value = cart[index].quantity;
        });
    });

    // Manual quantity input
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = e.target.closest('.quantity-controls').querySelector('.quantity-btn').dataset.index;
            const cart = JSON.parse(localStorage.getItem('cart'));
            cart[index].quantity = Math.max(1, +e.target.value);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCounter();
            updateSummary();
        });
    });

    // Remove items
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cart = JSON.parse(localStorage.getItem('cart'));
            cart.splice(e.target.dataset.index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCounter();
        });
    });
}

function updateSummary() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    document.querySelector('.subtotal-price').textContent = `${subtotal.toFixed(2)} EG`;
    document.querySelector('.total-price').textContent = `${subtotal.toFixed(2)} EG`;
}

function setupCheckout() {
    document.querySelector('.checkout-btn').addEventListener('click', () => {
        if (!JSON.parse(localStorage.getItem('cart')).length) {
            alert('Your cart is empty!');
            return;
        }
        
        if (confirm('Proceed to checkout?')) {
            localStorage.removeItem('cart');
            renderCart();
            updateCartCounter();
            alert('Order placed successfully! 🎉\nYour food will arrive in 2 hours!');
        }
    });
}
// Add this code INSIDE the existing DOMContentLoaded event listener
if (document.querySelector('.search-input')) {
    setupSearch();
}

function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const productItems = document.querySelectorAll('.product_items');

    function filterItems() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        productItems.forEach(item => {
            const itemName = item.querySelector('h2').textContent.toLowerCase();
            item.style.display = itemName.includes(searchTerm) ? 'block' : 'none';
        });
    }

    // Search on button click
    searchBtn.addEventListener('click', filterItems);
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') filterItems();
    });

    // Clear search when input is empty
    searchInput.addEventListener('input', (e) => {
        if (!e.target.value) productItems.forEach(item => item.style.display = 'block');
    });
}