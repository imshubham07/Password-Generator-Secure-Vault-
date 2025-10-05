export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

const CHARSET = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

// Characters that look similar and might be confusing
const SIMILAR_CHARS = 'il1Lo0O';

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  
  if (options.includeLowercase) {
    charset += CHARSET.lowercase;
  }
  
  if (options.includeUppercase) {
    charset += CHARSET.uppercase;
  }
  
  if (options.includeNumbers) {
    charset += CHARSET.numbers;
  }
  
  if (options.includeSymbols) {
    charset += CHARSET.symbols;
  }
  
  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
  }
  
  if (charset === '') {
    throw new Error('At least one character type must be selected');
  }
  
  let password = '';
  
  // Use crypto.getRandomValues for secure random number generation
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < options.length; i++) {
    password += charset.charAt(array[i] % charset.length);
  }
  
  return password;
}

export function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  
  // Length bonus
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character type bonuses
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  // Diversity bonus
  const uniqueChars = new Set(password.split('')).size;
  if (uniqueChars > password.length * 0.7) score += 1;
  
  let label = '';
  let color = '';
  
  if (score <= 2) {
    label = 'Weak';
    color = 'red';
  } else if (score <= 4) {
    label = 'Fair';
    color = 'orange';
  } else if (score <= 6) {
    label = 'Good';
    color = 'yellow';
  } else {
    label = 'Strong';
    color = 'green';
  }
  
  return { score, label, color };
}

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: false,
};
