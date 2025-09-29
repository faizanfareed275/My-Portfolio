// Form Validation - Contact form validation and submission

class FormValidator {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.isSubmitting = false;
        
        this.init();
    }
    
    init() {
        if (this.contactForm) {
            this.setupEventListeners();
        }
    }
    
    setupEventListeners() {
        // Form submission
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
        
        // Real-time validation
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
                // Real-time validation for email
                if (input.type === 'email' && input.value) {
                    this.validateField(input);
                }
            });
        });
    }
    
    async handleFormSubmission() {
        if (this.isSubmitting) return;
        
        if (!this.validateForm()) {
            return;
        }
        
        this.isSubmitting = true;
        this.setSubmitButtonLoading(true);
        
        try {
            const formData = this.getFormData();
            
            // Simulate form submission (replace with actual submission logic)
            await this.submitForm(formData);
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            this.resetForm();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Failed to send message. Please try again.');
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonLoading(false);
        }
    }
    
    async submitForm(formData) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real application, you would send the data to your backend
        // Example:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formData)
        // });
        // 
        // if (!response.ok) {
        //     throw new Error('Failed to submit form');
        // }
        
        // For demo purposes, we'll just log the data
        console.log('Form submitted:', formData);
        
        // Store submission in localStorage for demo
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push({
            ...formData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    }
    
    getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
    }
    
    validateForm() {
        const requiredFields = [
            { id: 'name', name: 'Name' },
            { id: 'email', name: 'Email' },
            { id: 'message', name: 'Message' }
        ];
        
        let isValid = true;
        
        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!this.validateField(element)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = this.getFieldName(field);
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, `${fieldName} is required`);
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        // Name validation (only letters, spaces, hyphens, apostrophes)
        if (field.id === 'name' && value && !this.isValidName(value)) {
            this.showFieldError(field, 'Name can only contain letters, spaces, hyphens, and apostrophes');
            return false;
        }
        
        // Message length validation
        if (field.id === 'message' && value && value.length < 10) {
            this.showFieldError(field, 'Message must be at least 10 characters long');
            return false;
        }
        
        // Subject length validation
        if (field.id === 'subject' && value && value.length > 100) {
            this.showFieldError(field, 'Subject must be less than 100 characters');
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidName(name) {
        const nameRegex = /^[a-zA-Z\s\-']+$/;
        return nameRegex.test(name);
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    getFieldName(field) {
        const label = field.parentNode.querySelector('label');
        if (label) {
            return label.textContent.replace('*', '').trim();
        }
        return field.name || field.id;
    }
    
    setSubmitButtonLoading(loading) {
        const submitButton = this.contactForm.querySelector('button[type="submit"]');
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoading = submitButton.querySelector('.btn-loading');
        
        if (loading) {
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline';
        } else {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
        }
    }
    
    showSuccessMessage() {
        if (window.portfolioApp && window.portfolioApp.showToast) {
            window.portfolioApp.showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
        } else {
            alert('Message sent successfully! I\'ll get back to you soon.');
        }
    }
    
    showErrorMessage(message) {
        if (window.portfolioApp && window.portfolioApp.showToast) {
            window.portfolioApp.showToast(message, 'error');
        } else {
            alert(message);
        }
    }
    
    resetForm() {
        this.contactForm.reset();
        
        // Clear all field errors
        const errorFields = this.contactForm.querySelectorAll('.error');
        errorFields.forEach(field => {
            this.clearFieldError(field);
        });
    }
    
    // Method to get all form submissions (for demo purposes)
    getSubmissions() {
        return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    }
    
    // Method to clear all submissions
    clearSubmissions() {
        localStorage.removeItem('contactSubmissions');
    }
    
    // Method to export submissions as JSON
    exportSubmissions() {
        const submissions = this.getSubmissions();
        if (submissions.length === 0) {
            this.showErrorMessage('No submissions to export');
            return;
        }
        
        const dataStr = JSON.stringify(submissions, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'contact-submissions.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        
        this.showSuccessMessage('Submissions exported successfully!');
    }
}

// Utility function to sanitize input
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Utility function to validate phone numbers (if needed)
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Initialize form validator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.formValidator = new FormValidator();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}
