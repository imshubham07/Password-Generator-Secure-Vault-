import CryptoJS from 'crypto-js';

export interface VaultItemData {
  username: string;
  password: string;
  notes: string;
}

// Generate a key from the user's master password
export function generateEncryptionKey(masterPassword: string, salt: string): string {
  return CryptoJS.PBKDF2(masterPassword, salt, {
    keySize: 256 / 32,
    iterations: 10000,
  }).toString();
}

// Generate a random salt
export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

// Encrypt data
export function encryptData(data: VaultItemData, encryptionKey: string): string {
  const dataString = JSON.stringify(data);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  
  const encrypted = CryptoJS.AES.encrypt(dataString, encryptionKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  
  // Combine IV and encrypted data
  const combined = iv.toString() + ':' + encrypted.toString();
  return combined;
}

// Decrypt data
export function decryptData(encryptedData: string, encryptionKey: string): VaultItemData | null {
  try {
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = CryptoJS.enc.Hex.parse(parts[0]);
    const encrypted = parts[1];
    
    const decrypted = CryptoJS.AES.decrypt(encrypted, encryptionKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      throw new Error('Decryption failed - invalid key or corrupted data');
    }
    
    return JSON.parse(decryptedString) as VaultItemData;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

// Create a master key derivation for the user
export function createUserSalt(email: string): string {
  // Create a deterministic but secure salt based on email
  return CryptoJS.SHA256(email + 'password-manager-salt').toString();
}

// Verify encryption key by trying to decrypt a test value
export function verifyEncryptionKey(encryptionKey: string): boolean {
  try {
    const testData: VaultItemData = { username: 'test', password: 'test', notes: 'test' };
    const encrypted = encryptData(testData, encryptionKey);
    const decrypted = decryptData(encrypted, encryptionKey);
    return decrypted !== null && decrypted.username === 'test';
  } catch {
    return false;
  }
}
