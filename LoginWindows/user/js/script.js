// User Login Script
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    const emailInput = document.getElementById('user-email');
    const passwordInput = document.getElementById('user-password');
    const rememberCheckbox = document.getElementById('user-remember');
    const loginButton = document.querySelector('.login-button');
    
    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate inputs
        if (!validateEmail(emailInput.value)) {
            showError('Please enter a valid email address');
            return;
        }
        
        if (passwordInput.value.length < 8) {
            showError('Password must be at least 8 characters');
            return;
        }
        
        // Add loading state
        loginButton.classList.add('loading');
        loginButton.disabled = true;
        
        try {
            // Simulated API call
            const response = await simulateLogin({
                email: emailInput.value,
                password: passwordInput.value,
                remember: rememberCheckbox.checked
            });
            
            if (response.success) {
                showSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    // Redirect or handle successful login
                    window.location.href = '/user/dashboard';
                }, 1500);
            } else {
                showError(response.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            showError('An error occurred. Please try again later.');
        } finally {
            loginButton.classList.remove('loading');
            loginButton.disabled = false;
        }
    });
    
    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Simulated login function
    function simulateLogin(credentials) {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                // Simple validation
                if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
                    resolve({ success: true });
                } else {
                    resolve({ success: false, message: 'Invalid credentials' });
                }
            }, 1000);
        });
    }
    
    // Show error message
    function showError(message) {
        // Remove any existing error
        removeExistingAlert();
        
        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        
        // Insert before form
        form.insertBefore(errorDiv, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeExistingAlert();
        }, 5000);
    }
    
    // Show success message
    function showSuccess(message) {
        // Remove any existing alert
        removeExistingAlert();
        
        // Create success element
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        
        // Insert before form
        form.insertBefore(successDiv, form.firstChild);
    }
    
    // Remove existing alert
    function removeExistingAlert() {
        const existing = document.querySelector('.alert');
        if (existing) {
            existing.remove();
        }
    }
});
