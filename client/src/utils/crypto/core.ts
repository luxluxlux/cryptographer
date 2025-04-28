import { AES, PBKDF2, HmacSHA512, lib } from 'crypto-js';
import { PARSED_VERSION } from 'utils/constants';
import {
    assemble,
    disassemble,
    concatWordArrays,
    readAsArrayBuffer,
    wordArrayToUint8Array,
} from './utils';
import {
    IV_SIZE,
    KEY_ITERATIONS,
    KEY_SIZE,
    SALT_SIZE,
    DEFAULT_CIPHER_PARAMS,
    FILE_FORMAT
} from './constants';

/**
 * Generate random salt
 * @returns Randomly generated salt
 */
export function generateSalt(): lib.WordArray {
    return lib.WordArray.random(SALT_SIZE);
}

/**
 * Generate random initialization vector (IV)
 * @returns Randomly generated initialization vector (IV)
 */
export function generateIV(): lib.WordArray {
    return lib.WordArray.random(IV_SIZE);
}

/**
 * Derive key from password and salt
 * @param password Password to be derived
 * @param salt Salt to be used
 * @returns Derived key
 */
export function getKey(password: string, salt: lib.WordArray): lib.WordArray {
    return PBKDF2(password, salt, {
        keySize: KEY_SIZE,
        iterations: KEY_ITERATIONS,
    });
}

/**
 * Calculate HMAC of the encrypted data
 * @param data Encrypted data
 * @param iv Initialization vector (IV)
 * @param key Hashed key
 * @returns HMAC of the encrypted data
 */
export function calcHMAC(data: lib.CipherParams, iv: lib.WordArray, key: lib.WordArray): lib.WordArray {
    // The chosen method is based on recommended parameters (https://www.keylength.com/)
    // and the fact that modern PC processors are increasingly built on 64-bit architecture,
    // which works faster with SHA512, while attackers use GPUs, which are poor at 64-bit arithmetic
    return HmacSHA512(concatWordArrays(data.ciphertext, iv), key);
}

/**
 * Build file by encrypted data
 * @param salt Salt used during encryption
 * @param hmac HMAC of the encrypted data
 * @param iv Initialization vector
 * @param cipher Cipher parameters containing the ciphertext
 * @returns Concatenated Uint8Array representing the encrypted file
 */
export function buildFile({
    salt,
    hmac,
    iv,
    cipher,
}: {
    salt: lib.WordArray;
    hmac: lib.WordArray;
    iv: lib.WordArray;
    cipher: lib.CipherParams;
}): Uint8Array {
    return assemble(FILE_FORMAT,
        cipher.ciphertext,
        iv,
        hmac,
        salt,
        new Uint8Array(PARSED_VERSION)
    );
}

/**
 * Encrypt a file using a password
 * @param file File to be encrypted.
 * @param password Password used for encryption.
 * @returns A promise that resolves to the encrypted file as a Uint8Array
 */
export async function encrypt(file: File, password: string): Promise<Uint8Array> {
    const salt = generateSalt();
    const key = getKey(password, salt);
    const iv = generateIV();
    const buffer = await readAsArrayBuffer(file);
    if (buffer.byteLength === 0) {
        throw new Error('The file is empty');
    }
    const data = lib.WordArray.create(buffer);
    const cipher = AES.encrypt(data, key, { iv });
    const hmac = calcHMAC(cipher, iv, key);
    return buildFile({
        salt,
        hmac,
        iv,
        cipher,
    });
}

/**
 * Parse file with encrypted data
 * @param file Processed file
 * @param password Password used for encryption
 * @returns A promise that resolves to an object containing the parsed file
 */
export async function parseFile(file: File, password: string): Promise<{
    hmac: lib.WordArray;
    iv: lib.WordArray;
    cipher: lib.CipherParams;
    key: lib.WordArray;
}> {
    const buffer = await readAsArrayBuffer(file);
    if (buffer.byteLength === 0) {
        throw new Error('The file is empty');
    }
    const arr = new Uint8Array(buffer);
    const [ciphertext, iv, hmac, salt, _version] = disassemble(FILE_FORMAT, arr);
    const key = getKey(password, salt);
    const cipher = lib.CipherParams.create({
        ciphertext,
        key,
        iv,
        salt,
        ...DEFAULT_CIPHER_PARAMS
    });
    return {
        key,
        hmac,
        iv,
        cipher,
    };
}

/**
 * Decrypts a file by a secret data
 * @param file Processed file
 * @param password Password
 * @returns A promise that resolves to the decrypted file as a Uint8Array
 */
export async function decrypt(file: File, password: string): Promise<Uint8Array> {
    const { key, hmac, iv, cipher } = await parseFile(file, password);
    if (calcHMAC(cipher, iv, key).toString() !== hmac.toString()) {
        throw new Error("The HMAC isn't correct");
    }
    const data = AES.decrypt(cipher, key, { iv });
    return wordArrayToUint8Array(data);
}

/**
 * Crypt a file by a secret data
 * @param action Type of an action
 * @param file Processed file
 * @param password Password
 * @returns A promise that resolves to the encrypted or decrypted file as a Uint8Array
 */
export async function crypt(
    action: 'encrypt' | 'decrypt',
    file: File,
    password: string
): Promise<Uint8Array> {
    switch (action) {
        case 'encrypt':
            return encrypt(file, password);
        case 'decrypt':
            return decrypt(file, password);
        default:
            throw new Error('The action is not encrypt or decrypt');
    }
}

