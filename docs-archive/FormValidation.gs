/**
 * FormValidation.gs - Validation and Calculation Logic
 * Handles all input validation, calculations, and data sanitization
 */

/**
 * validateAllFields - Validates all invoice form fields
 * @param {Object} invoiceData - The invoice data object
 * @return {Object} {isValid: boolean, errors: Array}
 */
function validateAllFields(invoiceData) {
  const errors = [];

  // Validate Vendor
  const vendorError = validateVendor(invoiceData.vendor);
  if (vendorError) {
    errors.push(vendorError);
  }

  // Validate Invoice Number
  const invoiceNumberError = validateInvoiceNumber(invoiceData.invoiceNumber);
  if (invoiceNumberError) {
    errors.push(invoiceNumberError);
  }

  // Validate Invoice Date
  const invoiceDateError = validateInvoiceDate(invoiceData.invoiceDate);
  if (invoiceDateError) {
    errors.push(invoiceDateError);
  }

  // Validate Currency Fields
  const flowerCostError = validateCurrency(invoiceData.flowerCost, 'Flower cost');
  if (flowerCostError) {
    errors.push(flowerCostError);
  }

  const suppliesCostError = validateCurrency(invoiceData.suppliesCost, 'Supplies cost');
  if (suppliesCostError) {
    errors.push(suppliesCostError);
  }

  const greensCostError = validateCurrency(invoiceData.greensCost, 'Greens cost');
  if (greensCostError) {
    errors.push(greensCostError);
  }

  const invoiceCreditsError = validateCurrency(invoiceData.invoiceCredits, 'Invoice credits');
  if (invoiceCreditsError) {
    errors.push(invoiceCreditsError);
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * validateInvoiceNumber - Validates invoice number format
 * @param {string} invoiceNumber - The invoice number
 * @return {string|null} Error message or null if valid
 */
function validateInvoiceNumber(invoiceNumber) {
  if (!invoiceNumber || invoiceNumber.trim() === '') {
    return 'Invoice number is required';
  }

  const trimmedNumber = invoiceNumber.trim();

  if (trimmedNumber.length > 50) {
    return 'Invoice number must be 50 characters or less';
  }

  // Allow alphanumeric and common separators (-, _, .)
  const invoiceNumberRegex = /^[a-zA-Z0-9\-_.]+$/;
  if (!invoiceNumberRegex.test(trimmedNumber)) {
    return 'Invoice number can only contain letters, numbers, and -, _, .';
  }

  return null;
}

/**
 * validateInvoiceDate - Validates invoice date
 * @param {string} invoiceDate - The invoice date (YYYY-MM-DD format)
 * @return {string|null} Error message or null if valid
 */
function validateInvoiceDate(invoiceDate) {
  if (!invoiceDate || invoiceDate.trim() === '') {
    return 'Invoice date is required';
  }

  // Parse date
  const date = new Date(invoiceDate + 'T00:00:00Z');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }

  // Check if date is in the future
  if (date > today) {
    return 'Invoice date cannot be in the future';
  }

  return null;
}

/**
 * validateVendor - Validates the vendor name
 * @param {string} vendorName - The vendor name
 * @return {string|null} Error message or null if valid
 */
function validateVendor(vendorName) {
  if (!vendorName || vendorName.trim() === '') {
    return 'Vendor is required';
  }

  const trimmedName = vendorName.trim();

  if (trimmedName.length > 100) {
    return 'Vendor name must be 100 characters or less';
  }

  // Allow alphanumeric, spaces, hyphens, apostrophes, and ampersands
  const validNamePattern = /^[a-zA-Z0-9\s\-'&]+$/;
  if (!validNamePattern.test(trimmedName)) {
    return 'Vendor name contains invalid characters. Use letters, numbers, spaces, hyphens, apostrophes, or ampersands.';
  }

  return null;
}

/**
 * validateCurrency - Validates currency amount
 * @param {number} amount - The amount to validate
 * @param {string} fieldName - The field name for error message
 * @return {string|null} Error message or null if valid
 */
function validateCurrency(amount, fieldName = 'Amount') {
  if (amount === null || amount === undefined || amount === '') {
    return null; // Currency fields are optional
  }

  const parsedAmount = parseFloat(amount);

  if (isNaN(parsedAmount)) {
    return fieldName + ' must be a valid number';
  }

  if (parsedAmount < 0) {
    return fieldName + ' cannot be negative';
  }

  // Check decimal places (max 2)
  const decimalPlaces = (amount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return fieldName + ' cannot have more than 2 decimal places';
  }

  return null;
}

/**
 * calculateTotal - Calculates the total due
 * Formula: (Flower + Supplies + Greens) - Credits
 * @param {number} flowerCost
 * @param {number} suppliesCost
 * @param {number} greensCost
 * @param {number} invoiceCredits
 * @return {number} The calculated total
 */
function calculateTotal(flowerCost, suppliesCost, greensCost, invoiceCredits) {
  const flower = parseFloat(flowerCost) || 0;
  const supplies = parseFloat(suppliesCost) || 0;
  const greens = parseFloat(greensCost) || 0;
  const credits = parseFloat(invoiceCredits) || 0;

  // Calculate with proper rounding to 2 decimal places
  const total = Math.round((flower + supplies + greens - credits) * 100) / 100;

  return total;
}

/**
 * sanitizeInput - Removes potentially harmful characters from input
 * @param {string} input - The input string
 * @return {string} The sanitized string
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove leading/trailing whitespace
  let sanitized = input.trim();

  // Remove HTML/script tags (basic protection)
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
  sanitized = sanitized.replace(/<[^>]+>/g, '');

  return sanitized;
}

/**
 * formatCurrencyForDisplay - Formats a number as USD currency
 * @param {number} amount - The amount to format
 * @return {string} Formatted currency string
 */
function formatCurrencyForDisplay(amount) {
  const num = parseFloat(amount) || 0;
  return '$' + num.toFixed(2);
}

/**
 * formatDateForDisplay - Formats a date string
 * @param {string} dateString - The date string (YYYY-MM-DD)
 * @return {string} Formatted date
 */
function formatDateForDisplay(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00Z');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * getCurrentTimestamp - Gets current timestamp in YYYY-MM-DD HH:MM:SS format
 * @return {string} Current timestamp
 */
function getCurrentTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * generateUUID - Generates a simple UUID v4
 * @return {string} Generated UUID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
