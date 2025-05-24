/**
 * Utilities for email validation, correction and handling
 */

// Common email domain typos and their corrections
const EMAIL_DOMAIN_FIXES = {
  // Gmail typos
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.om": "gmail.com",
  "gmal.com": "gmail.com",
  "gmail.con": "gmail.com",

  // Yahoo typos
  "yaho.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yhoo.com": "yahoo.com",

  // Hotmail typos
  "hotmal.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "homtail.com": "hotmail.com",
  "hotmail.co": "hotmail.com",

  // Outlook typos
  "outlook.co": "outlook.com",
  "outloo.com": "outlook.com",
  "outlok.com": "outlook.com",
};

// Known problematic emails and their corrections
const SPECIFIC_EMAIL_FIXES = {
  "shrishtipradeep6@gmai.com": "shrishtipradeep6@gmail.com",
  // Add more specific fixes as needed
};

/**
 * Validates if an email address format is correct
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email format is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

/**
 * Attempts to correct common typos in email addresses
 * @param {string} email - The email address to correct
 * @returns {string} The corrected email address or the original if no correction was needed
 */
export const correctEmailTypos = (email) => {
  if (!email) return email;

  // Check for specific known problematic emails first
  if (SPECIFIC_EMAIL_FIXES[email]) {
    return SPECIFIC_EMAIL_FIXES[email];
  }

  let corrected = email.trim().toLowerCase();

  // Apply domain fixes for common typos
  for (const [typo, correction] of Object.entries(EMAIL_DOMAIN_FIXES)) {
    if (corrected.endsWith(typo)) {
      corrected = corrected.replace(new RegExp(typo + "$"), correction);
      break; // Only apply one domain fix
    }
  }

  return corrected;
};

/**
 * Analyzes email validity and suggests corrections
 * @param {string} email - The email address to analyze
 * @returns {Object} Analysis result with isValid, corrected, and errorType
 */
export const analyzeEmail = (email) => {
  if (!email) {
    return {
      isValid: false,
      corrected: null,
      errorType: "empty",
    };
  }

  const corrected = correctEmailTypos(email);
  const wasFixed = email !== corrected;
  const isValid = isValidEmail(corrected);

  return {
    original: email,
    corrected: wasFixed ? corrected : null,
    isValid,
    wasFixed,
    errorType: !isValid ? "format" : null,
  };
};

export default {
  isValidEmail,
  correctEmailTypos,
  analyzeEmail,
};
