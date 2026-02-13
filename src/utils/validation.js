export function validateName(name) {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Name is required' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  if (trimmed.length > 50) {
    return { valid: false, error: 'Name must be 50 characters or fewer' };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  return { valid: true, error: null };
}

export function validateContact(contact) {
  if (!contact || !contact.trim()) {
    return { valid: false, error: 'Contact number is required' };
  }
  const digits = contact.replace(/[\s\-()]/g, '');
  if (!/^\+?\d{7,15}$/.test(digits)) {
    return { valid: false, error: 'Enter a valid phone number (7-15 digits)' };
  }
  return { valid: true, error: null };
}

export function validateAge(age) {
  const num = Number(age);
  if (!age && age !== 0) {
    return { valid: false, error: 'Age is required' };
  }
  if (!Number.isInteger(num) || num < 5 || num > 99) {
    return { valid: false, error: 'Age must be between 5 and 99' };
  }
  return { valid: true, error: null };
}

export function validateScore(score) {
  const num = Number(score);
  if (score === '' || score === null || score === undefined) {
    return { valid: false, error: 'Score is required' };
  }
  if (!Number.isInteger(num) || num < 0) {
    return { valid: false, error: 'Score must be a non-negative whole number' };
  }
  if (num > 99999) {
    return { valid: false, error: 'Score cannot exceed 99999' };
  }
  return { valid: true, error: null };
}
