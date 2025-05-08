// Wait for the DOM content to load before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Select the form element
    const form = document.querySelector('form');
    
    // Add submit event listener to the form
    form.addEventListener('submit', function(e) {
        // Prevent default form submission behavior
        e.preventDefault();

        // Get input values from form elements
        const username = document.getElementById('username').value.trim();
        const phone = document.getElementById('phone-number').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Regular expression for Egyptian phone numbers
        const phoneRegex = /^01[0125]\d{8}$/;
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validation checks
        if (username.length < 2) {
            alert('Username must be at least 2 characters long');
            return;
        }

        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid Egyptian phone number (e.g., 01012345678)');
            return;
        }

        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (message.length < 3) {
            alert('Message must be at least 3 characters long');
            return;
        }

        // If all validations pass
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Message sent successfully!';
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