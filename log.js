// Wait for the DOM content to load before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Select the form element
    const form = document.querySelector('form');
    
    // Add submit event listener to the form
    form.addEventListener('submit', function(e) {
        // Prevent default form submission behavior
        e.preventDefault();

        // Get input values from form elements
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remeber-Pass').checked;

        // Regular expressions for validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validation checks
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (password.length < 8 || password.length > 15) {
            alert('Password must be 8-15 characters long');
            return;
        }

        // If all validations pass
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Login successful! Welcome back to Dream Restaurant!';
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #4CAF50;
            color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
        `;
        
        // Add success message to the body
        document.body.appendChild(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 3000);

        // Reset the form after submission
        form.reset();
    });
});