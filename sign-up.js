// Wait for the DOM content to load before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Select the form element
    const form = document.querySelector('form');
    
    // Add submit event listener to the form
    form.addEventListener('submit', function(e) {
        // Prevent default form submission behavior
        e.preventDefault();

        // Get input values from form elements
        const firstName = document.getElementById('fn').value.trim();
        const lastName = document.getElementById('ln').value.trim();
        const phone = document.getElementById('pn').value.trim();
        const birthDate = document.getElementById('d').value;
        const gender = document.getElementById('gender').value;
        const email = document.getElementById('g').value.trim();
        const password = document.getElementById('p').value;
        const confirmPassword = document.getElementById('cp').value;

        // Regular expressions for validation
        const phoneRegex = /^01[0125]\d{8}$/; // Egyptian phone number
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validation checks
        if (firstName.length < 3 || firstName.length > 10) {
            alert('First name must be 3-10 characters long');
            return;
        }

        if (lastName.length < 3 || lastName.length > 10) {
            alert('Last name must be 3-10 characters long');
            return;
        }

        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid Egyptian phone number (e.g., 01012345678)');
            return;
        }

        if (!birthDate) {
            alert('Please select your birth date');
            return;
        }

        if (gender === 'gender') {
            alert('Please select your gender');
            return;
        }

        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (password.length < 8 || password.length > 15) {
            alert('Password must be 8-15 characters long');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // If all validations pass
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.textContent = 'Sign up successful! Welcome to Dream Restaurant!';
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