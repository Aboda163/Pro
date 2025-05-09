// menu.js - Professional Cart & Menu Management System

class CartManager {
    constructor() {
        this.cartKey = 'dreamRestaurantCart';
        this.initCart();
        generateUniqueID(item); {
    return `${item.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
}

validateCartItem(item); {
    return item && item.name && typeof item.price === 'number' && item.image;
}
    }

    // Initialize cart in localStorage if not exists
    initCart() {
        if (!localStorage.getItem(this.cartKey)) {
            localStorage.setItem(this.cartKey, JSON.stringify([]));
        }
    }

    // Get current cart items
    getCart() {
        return JSON.parse(localStorage.getItem(this.cartKey));
    }

    // Save updated cart to localStorage
    updateCart(cart) {
        localStorage.setItem(this.cartKey, JSON.stringify(cart));
        this.updateCartCounter();
    }

    // Add item to cart with validation
    addToCart(item) {
    if (!this.validateCartItem(item)) {
        console.error('Invalid item structure:', item);
        return;
    }
    
    const cart = this.getCart();
    const existingItem = cart.find(cartItem => 
        cartItem.name === item.name && cartItem.price === item.price
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ 
            ...item,
            id: this.generateUniqueID(item),
            quantity: 1 
        });
    }

    this.updateCart(cart);
    this.showAddedNotification(item.name);
}

    // Remove item from cart
    removeItem(itemId) {
        const cart = this.getCart().filter(item => item.id !== itemId);
        this.updateCart(cart);
    }

    // Update item quantity
    updateQuantity(itemId, newQuantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === itemId);

        if (item) {
            newQuantity > 0 ? item.quantity = newQuantity : this.removeItem(itemId);
            this.updateCart(cart);
        }
    }

    // Update cart counter in navbar
    updateCartCounter() {
        const counters = document.querySelectorAll('.cart-counter');
        const cart = this.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        counters.forEach(counter => {
            counter.textContent = totalItems;
        });
    }

    // Show item added notification
    showAddedNotification(itemName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <span>${itemName} added to cart!</span>
            <i class="fas fa-check"></i>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    // Calculate order totals
    calculateTotals() {
    const cart = this.getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return {
        subtotal: subtotal.toFixed(2),
        total: subtotal.toFixed(2),
        currency: 'EG' // Add currency specification
    };
}

    // Handle checkout process
    handleCheckout() {
        const cart = this.getCart();
        if (cart.length === 0) {
            alert('Your cart is empty! Please add items before checking out.');
            return;
        }

        if (confirm('Proceed to checkout? This will clear your current cart.')) {
            localStorage.removeItem(this.cartKey);
            window.location.href = 'HomePage.html';
        }
    }
}

// Initialize Cart Manager
const cartManager = new CartManager();

// Menu Page Functionality
if (document.querySelector('.add-to-cart-btn')) {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize cart counter
        cartManager.updateCartCounter();

        // Add to cart handlers
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = button.closest('.product_items');
                const item = {
                    id: productCard.querySelector('h2').textContent.trim(),
                    name: productCard.querySelector('h2').textContent.trim(),
                    price: parseFloat(productCard.querySelector('p:last-of-type').textContent.match(/\d+/)[0]),
                    image: productCard.querySelector('img').src
                };
                cartManager.addToCart(item);
            });
        });
    });
}

// Cart Page Functionality
if (document.querySelector('.cart-content')) {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize cart display
        renderCartItems();
        setupEventListeners();
        cartManager.updateCartCounter();

        // Checkout button handler
        document.querySelector('.checkout-btn').addEventListener('click', () => {
            cartManager.handleCheckout();
        });
    });

    function renderCartItems() {
    const cartContent = document.querySelector('.cart-content');
    const cart = cartManager.getCart();
    const { subtotal, total, currency } = cartManager.calculateTotals();

    cartContent.innerHTML = cart.length > 0 ? '' : '<p class="empty-cart">Your cart is empty. Start adding items from the menu!</p>';

        // Clear existing content
        cartContent.innerHTML = '';

        // Render cart items
        cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.itemId = item.id;
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="item-details">
                <h3 class="item-title">${item.name}</h3>
                <p class="item-price">${item.price} ${currency}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus">−</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                    <button class="quantity-btn plus">+</button>
                </div>
            </div>
            <button class="remove-btn" aria-label="Remove item">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartContent.appendChild(cartItem);
    });

        // Update totals
    document.querySelector('.subtotal-price').textContent = `${subtotal} ${currency}`;
    document.querySelector('.total-price').textContent = `${total} ${currency}`;
}

    function setupEventListeners() {
    // Debounce function for quantity updates
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

         // Remove items
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => {
            const cartItem = button.closest('.cart-item');
            cartItem.classList.add('removing');
            setTimeout(() => {
                cartManager.removeItem(cartItem.dataset.itemId);
                renderCartItems();
            }, 300);
        });
    });

        // Quantity updates with debouncing
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('input', debounce((e) => {
            const cartItem = e.target.closest('.cart-item');
            const cartContent = document.querySelector('.cart-content');
            
            cartContent.classList.add('loading');
            setTimeout(() => {
                cartManager.updateQuantity()
                    cartItem.dataset.itemId, 
                    Math.max(1, parseInt(e.target.value) || 1
                );
                renderCartItems();
                cartContent.classList.remove('loading');
            }, 200);
        }, 300));
    });
}

// Add notification styling
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .cart-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4E1F00;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(notificationStyle);
// Add at the bottom of menu.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const productItems = document.querySelectorAll('.product_items');
            
            productItems.forEach(item => {
                const itemName = item.querySelector('h2').textContent.toLowerCase();
                item.style.display = itemName.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }
});}
 // Plus/Minus buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const input = e.target.closest('.quantity-controls').querySelector('input');
            const cartItem = e.target.closest('.cart-item');
            const currentValue = parseInt(input.value);
            
            input.value = button.classList.contains('plus') ? currentValue + 1 : Math.max(1, currentValue - 1);
            
            const cartContent = document.querySelector('.cart-content');
            cartContent.classList.add('loading');
            
            setTimeout(() => {
                cartManager.updateQuantity(
                    cartItem.dataset.itemId, 
                    parseInt(input.value)
                );
                renderCartItems();
                cartContent.classList.remove('loading');
            }, 200);
        });
    });
