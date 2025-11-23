import CryptoJS from 'crypto-js';

export const encryptMessage = (message, password) => {
  try {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 1000
    });
    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    const encrypted = CryptoJS.AES.encrypt(message, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    const encryptedMessage = `${salt.toString(CryptoJS.enc.Base64)}.${iv.toString(CryptoJS.enc.Base64)}.${encrypted.toString()}`;
    return encryptedMessage;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt message');
  }
};

export const decryptMessage = (encryptedMessage, password) => {
  try {
    const [saltB64, ivB64, encryptedB64] = encryptedMessage.split('.');
    const salt = CryptoJS.enc.Base64.parse(saltB64);
    const iv = CryptoJS.enc.Base64.parse(ivB64);
    const encrypted = encryptedB64;

    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 1000
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt message');
  }
};