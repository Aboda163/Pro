// Select the form element from the DOM
const form = document.querySelector('form');

// Add event listener for form submission
form.addEventListener('submit', (e) => {
  // Prevent default form submission behavior
    e.preventDefault();

  // Clear previous error messages
    clearErrors();

  // Validate all fields and get validation status
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isPhoneValid = validatePhone();
    const isDateValid = validateDate();
    const isGenderValid = validateGender();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

  // If all validations pass, submit the form
if (
    isFirstNameValid &&
    isLastNameValid &&
    isPhoneValid &&
    isDateValid &&
    isGenderValid &&
    isEmailValid &&
    isPasswordValid
) {
    form.submit(); // Replace with actual API call in production
}
});

// Helper function to display error messages
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.style.color = 'red';
    errorSpan.textContent = message;
    input.parentNode.appendChild(errorSpan);
}

// Clear all existing error messages
function clearErrors() {
    document.querySelectorAll('.error-message').forEach((error) => error.remove());
}

// Validation functions for each field
function validateFirstName() {
    const firstName = document.getElementById('fn').value.trim();
    if (firstName.length < 3 || firstName.length > 10) {
    showError('fn', 'First name must be 3-10 characters');
    return false;
    }
    return true;
}

function validateLastName() {
    const lastName = document.getElementById('ln').value.trim();
    if (lastName.length < 3 || lastName.length > 10) {
    showError('ln', 'Last name must be 3-10 characters');
    return false;
    }
    return true;
}

function validatePhone() {
    const phone = document.getElementById('pn').value.trim();
  const phoneRegex = /^\d+$/; // Only digits allowed
    if (!phoneRegex.test(phone) {
    showError('pn', 'Invalid phone number (digits only)');
    return false;
    }
    if (phone.length < 11 || phone.length > 15) {
    showError('pn', 'Phone must be 11-15 digits');
    return false;
    }
    return true;
}

function validateDate() {
    const date = document.getElementById('d').value;
    if (!date) {
    showError('d', 'Date of birth is required');
    return false;
    }
    return true;
}

function validateGender() {
    const gender = document.getElementById('gender').value;
    if (gender === 'gender') {
    showError('gender', 'Please select a gender');
    return false;
    }
    return true;
}

function validateEmail() {
    const email = document.getElementById('g').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    showError('g', 'Invalid email format');
    return false;
    }
    return true;
}

function validatePassword() {
    const password = document.getElementById('p').value;
    const confirmPassword = document.getElementById('cp').value;
    if (password.length < 8 || password.length > 15) {
    showError('p', 'Password must be 8-15 characters');
    return false;
    } 
    if (password !== confirmPassword) {
    showError('cp', 'Passwords do not match');
    return false;
    }
    return true;
}