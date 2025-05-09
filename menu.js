document.addEventListener('DOMContentLoaded', () => {
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCounter = document.querySelectorAll('.cart-counter');
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image,
                quantity: 1
            };

            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(product);
            }

            updateCart();
        });
    });

    // Update cart storage and UI
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        cartCounter.forEach(counter => {
            counter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        });
    }

    // Cart page calculations
    if (document.querySelector('.cart-container')) {
        loadCartItems();
        updateOrderSummary();
    }

    function loadCartItems() {
        const cartContent = document.querySelector('.cart-content');
        cartContent.innerHTML = '';

        if (cart.length === 0) {
            cartContent.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            return;
        }

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
                <div class="item-price">
                    ${formatCurrency(item.price * item.quantity)}
                </div>
                <button class="remove-btn">&times;</button>
            `;

            // Quantity controls
            const quantityInput = cartItem.querySelector('.quantity-input');
            const minusBtn = cartItem.querySelector('.minus');
            const plusBtn = cartItem.querySelector('.plus');
            const removeBtn = cartItem.querySelector('.remove-btn');

            quantityInput.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                if (newQuantity >= 1) {
                    cart[index].quantity = newQuantity;
                    updateCart();
                    updateOrderSummary();
                }
            });

            minusBtn.addEventListener('click', () => {
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    quantityInput.value = cart[index].quantity;
                    updateCart();
                    updateOrderSummary();
                }
            });

            plusBtn.addEventListener('click', () => {
                cart[index].quantity++;
                quantityInput.value = cart[index].quantity;
                updateCart();
                updateOrderSummary();
            });

            removeBtn.addEventListener('click', () => {
                cart.splice(index, 1);
                cartItem.classList.add('removing');
                setTimeout(() => {
                    cartContent.removeChild(cartItem);
                    updateCart();
                    updateOrderSummary();
                    loadCartItems();
                }, 300);
            });

            cartContent.appendChild(cartItem);
        });
    }

    function updateOrderSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal;

        document.querySelector('.subtotal-price').textContent = formatCurrency(subtotal);
        document.querySelector('.total-price').textContent = formatCurrency(total);
    }

    function formatCurrency(amount) {
        return `EGP ${amount.toFixed(2)}`;
    }
    function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}
    document.querySelector('.checkout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Please add items to your cart before checking out');
        return;
    }

    // Show confirmation first
    showToast('Thank you for your order!');
    
    // Clear cart after short delay
    setTimeout(() => {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        window.location.href = 'HomePage.html';
    }, 2500); // Matches toast duration
});
});