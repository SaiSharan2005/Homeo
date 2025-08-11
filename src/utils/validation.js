import { VALIDATION } from '../config/constants';

// Email validation
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!VALIDATION.EMAIL_REGEX.test(email)) return 'Please enter a valid email address';
  return null;
};

// Phone number validation
export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  if (!VALIDATION.PHONE_REGEX.test(phone)) return 'Please enter a valid 10-digit phone number';
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`;
  }
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  const requiredError = validateRequired(name, fieldName);
  if (requiredError) return requiredError;
  
  if (name.length < 2) return `${fieldName} must be at least 2 characters long`;
  if (name.length > 50) return `${fieldName} must be less than 50 characters`;
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  
  return null;
};

// Age validation
export const validateAge = (age) => {
  if (!age) return 'Age is required';
  
  const ageNum = parseInt(age);
  if (isNaN(ageNum)) return 'Age must be a valid number';
  if (ageNum < 0 || ageNum > 150) return 'Age must be between 0 and 150';
  
  return null;
};

// Date validation
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) return `${fieldName} is required`;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return `Please enter a valid ${fieldName.toLowerCase()}`;
  
  return null;
};

// Future date validation
export const validateFutureDate = (date, fieldName = 'Date') => {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj < today) return `${fieldName} must be in the future`;
  
  return null;
};

// Past date validation
export const validatePastDate = (date, fieldName = 'Date') => {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj > today) return `${fieldName} must be in the past`;
  
  return null;
};

// Number validation
export const validateNumber = (value, fieldName = 'Number', min = null, max = null) => {
  if (!value && value !== 0) return `${fieldName} is required`;
  
  const num = parseFloat(value);
  if (isNaN(num)) return `${fieldName} must be a valid number`;
  
  if (min !== null && num < min) return `${fieldName} must be at least ${min}`;
  if (max !== null && num > max) return `${fieldName} must be at most ${max}`;
  
  return null;
};

// Positive number validation
export const validatePositiveNumber = (value, fieldName = 'Number') => {
  return validateNumber(value, fieldName, 0);
};

// Integer validation
export const validateInteger = (value, fieldName = 'Number', min = null, max = null) => {
  const numberError = validateNumber(value, fieldName, min, max);
  if (numberError) return numberError;
  
  const num = parseFloat(value);
  if (!Number.isInteger(num)) return `${fieldName} must be a whole number`;
  
  return null;
};

// URL validation
export const validateUrl = (url) => {
  if (!url) return 'URL is required';
  
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

// File validation
export const validateFile = (file, options = {}) => {
  const {
    required = true,
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    fieldName = 'File'
  } = options;
  
  if (required && !file) return `${fieldName} is required`;
  if (!file) return null;
  
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return `${fieldName} size must be less than ${maxSizeMB}MB`;
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    const types = allowedTypes.map(type => type.split('/')[1]).join(', ');
    return `${fieldName} must be one of: ${types}`;
  }
  
  return null;
};

// Array validation
export const validateArray = (array, fieldName = 'Array', minLength = null, maxLength = null) => {
  if (!Array.isArray(array)) return `${fieldName} must be an array`;
  
  if (minLength !== null && array.length < minLength) {
    return `${fieldName} must have at least ${minLength} items`;
  }
  
  if (maxLength !== null && array.length > maxLength) {
    return `${fieldName} must have at most ${maxLength} items`;
  }
  
  return null;
};

// Object validation
export const validateObject = (obj, fieldName = 'Object') => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return `${fieldName} must be an object`;
  }
  return null;
};

// Custom validation function
export const validateCustom = (value, validator, fieldName = 'Field') => {
  try {
    const result = validator(value);
    if (result !== null && result !== undefined) {
      return typeof result === 'string' ? result : `${fieldName} is invalid`;
    }
    return null;
  } catch (error) {
    return `${fieldName} validation failed`;
  }
};

// Validate form data object
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(fieldName => {
    const value = formData[fieldName];
    const rules = validationRules[fieldName];
    
    // Handle array of validation functions
    if (Array.isArray(rules)) {
      for (const rule of rules) {
        const error = rule(value, fieldName);
        if (error) {
          errors[fieldName] = error;
          break; // Stop at first error for this field
        }
      }
    } else {
      // Handle single validation function
      const error = rules(value, fieldName);
      if (error) {
        errors[fieldName] = error;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Sanitize input (basic XSS prevention)
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Format validation error for display
export const formatValidationError = (errors) => {
  if (typeof errors === 'string') return errors;
  if (Array.isArray(errors)) return errors.join(', ');
  if (typeof errors === 'object') {
    return Object.values(errors).join(', ');
  }
  return 'Validation error';
}; 