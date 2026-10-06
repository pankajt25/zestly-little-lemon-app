/**
 * src/utils/validation.js
 * Form validation and formatting helpers for Onboarding and Profile screens.
 */

// First name must be non-empty and letters only (letters, hyphens, spaces, apostrophes)
export function isValidFirstName(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length < 1) return false;
  return /^[a-zA-Z\s'-]+$/.test(trimmed);
}

// Last name is optional, but if entered must be valid letters
export function isValidLastName(name) {
  if (!name || typeof name !== 'string' || name.trim().length === 0) return true;
  return /^[a-zA-Z\s'-]+$/.test(name.trim());
}

// Standard email regex
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

// Phone number: optional, but if entered must contain exactly 10 US digits
export function isValidPhoneNumber(phone) {
  if (!phone || typeof phone !== 'string' || phone.trim().length === 0) return true;
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10;
}

// Auto-formats digits into standard US phone format: (XXX) XXX-XXXX
export function formatPhoneNumber(text) {
  if (!text) return '';
  const digits = text.replace(/\D/g, '').slice(0, 10);
  const len = digits.length;

  if (len === 0) return '';
  if (len <= 3) return `(${digits}`;
  if (len <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export default {
  isValidFirstName,
  isValidLastName,
  isValidEmail,
  isValidPhoneNumber,
  formatPhoneNumber,
};
