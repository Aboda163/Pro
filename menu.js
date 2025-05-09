    // restaurant.js

    // Cart Manager Class
    class CartManager {
    constructor() {
        this.cartKey = 'restaurantCart';
        this.initCart();
        this.updateCartCounter();
    }

    // Initialize cart in localStorage
    initCart() {
        if (!localStorage.getItem(this.cartKey)) {
        localStorage.setItem(this.cartKey, JSON.stringify([]));
        }
    }

    // Get current cart
    getCart() {
        return JSON.parse(localStorage.getItem(this.cartKey)) || [];
    }

    // Save cart to localStorage
    saveCart(cart) {
        localStorage.setItem(this.cartKey, JSON.stringify(cart));
        this.updateCartCounter();
        if (window.location.pathname.includes('Cart.html')) {
        this.displayCartItems();
        }
    }

    // Add item to cart
    addToCart(item) {
        const cart = this.getCart();
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
        existingItem.quantity += 1;
        } else {
        cart.push({ ...item, quantity: 1 });
        }

        this.saveCart(cart);
        this.showAddedNotification(item.name);
    }

    // Remove item from cart
    removeFromCart(itemId) {
        const cart = this.getCart().filter(item => item.id !== itemId);
        this.saveCart(cart);
    }

    // Update item quantity
    updateQuantity(itemId, newQuantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === itemId);

        if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            this.removeFromCart(itemId);
            return;
        }
        this.saveCart(cart);
        }
    }

    // Clear entire cart
    clearCart() {
        this.saveCart([]);
    }

    // Show add to cart notification
    showAddedNotification(itemName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${itemName} added to cart
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    // Update cart counter in navbar
    updateCartCounter() {
        const cart = this.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        document.querySelectorAll('.cart-counter').forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'inline-block' : 'none';
        });
    }

    // Display cart items on cart page
    displayCartItems() {
        const cartContainer = document.querySelector('.cart-content');
        const cart = this.getCart();
        
        if (!cartContainer) return;

        cartContainer.innerHTML = cart.length ? 
        cart.map(item => `
            <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                <div class="quantity-controls">
                <button class="quantity-btn" data-id="${item.id}" data-action="decrease">
                    -
                </button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-action="increase">
                    +
                </button>
                </div>
                <button class="remove-btn" data-id="${item.id}">
                <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            </div>
        `).join('') 
        : '<p class="empty-cart">Your cart is empty. Start adding items from our menu!</p>';

        this.updateTotals();
        this.addCartEventListeners();
    }

    // Update order totals
    updateTotals() {
        const subtotal = this.getCart().reduce((sum, item) => 
        sum + (item.price * item.quantity), 0);
        
        document.querySelector('.subtotal-price').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.total-price').textContent = `$${subtotal.toFixed(2)}`;
    }

    // Add cart event listeners
    addCartEventListeners() {
        // Quantity controls
        document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = e.target.dataset.id;
            const action = e.target.dataset.action;
            const quantityElement = e.target.parentElement.querySelector('.item-quantity');
            let currentQuantity = parseInt(quantityElement.textContent);

            currentQuantity = action === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
            this.updateQuantity(itemId, currentQuantity);
        });
        });

        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            this.removeFromCart(e.target.closest('button').dataset.id);
        });
        });

        // Checkout button
        document.querySelector('.checkout-btn')?.addEventListener('click', () => {
        this.handleCheckout();
        });
    }

    // Handle checkout process
    handleCheckout() {
        alert('Thank you for your order! Redirecting to homepage...');
        this.clearCart();
        setTimeout(() => window.location.href = 'HomePage.html', 2000);
    }
    }

    // Initialize Cart Manager
    const cartManager = new CartManager();

    // Menu Page Functionality
    if (window.location.pathname.includes('menu.html')) {
    document.querySelectorAll('.product_items').forEach(item => {
        const addButton = item.querySelector('a[href="#"]');
        const productDetails = item.querySelector('.product_item_image_description');
        
        const product = {
        id: productDetails.querySelector('h2').textContent.trim().toLowerCase().replace(/\s+/g, '-'),
        name: productDetails.querySelector('h2').textContent.trim(),
        price: parseFloat(
            productDetails.querySelector('p')
            .textContent
            .replace('Price', '')
            .replace('EG', '')
            .replace('$', '')
            .trim()
        ),
        image: item.querySelector('img').src
        };

        addButton.addEventListener('click', (e) => {
        e.preventDefault();
        cartManager.addToCart(product);
        });
    });
    }

    // Cart Page Initialization
    if (window.location.pathname.includes('Cart.html')) {
    cartManager.displayCartItems();
    }

    // Update cart counter on all pages when DOM loads
    document.addEventListener('DOMContentLoaded', () => {
    cartManager.updateCartCounter();
    });