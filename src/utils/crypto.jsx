import CryptoJS from "crypto-js";

export const encryptMessage = (message, password) => {
  const encrypted = CryptoJS.AES.encrypt(message, password).toString();
  return encrypted;
};

export const decryptMessage = (cipherText, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch {
    return null;
  }
};
