import { AES, PBKDF2, HmacSHA512, lib } from 'crypto-js';
import { Action } from 'utils/interfaces';
import { PARSED_VERSION } from 'utils/constants';
import {
    assemble,
    disassemble,
    concatWordArrays,
    readAsArrayBuffer,
    wordArrayToUint8Array,
    compareArrayBuffers,
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
 * Check if the decrypted buffer matches the original buffer
 * @param origin The original buffer to compare with
 * @param encrypted The encrypted buffer to decrypt and compare
 * @param password The password used for decryption
 * @returns A promise that resolves to true if the decrypted buffer matches the original buffer, false otherwise
 */
export async function checkBack(origin: ArrayBufferLike, encrypted: ArrayBufferLike, password: string): Promise<boolean> {
    const decrypted = await decryptBuffer(encrypted, password);
    return compareArrayBuffers(origin, decrypted.buffer);
}

/**
 * Encrypt a file data using a password
 * @param buffer Data to be encrypted
 * @param password Password used for encryption
 * @returns A promise that resolves to the encrypted file data as a Uint8Array
 */
export async function encryptBuffer(buffer: ArrayBuffer, password: string): Promise<Uint8Array> {
    if (buffer.byteLength === 0) {
        throw new Error('The buffer is empty');
    }
    const salt = generateSalt();
    const key = getKey(password, salt);
    const iv = generateIV();
    const data = lib.WordArray.create(buffer);
    const cipher = AES.encrypt(data, key, { iv });
    const hmac = calcHMAC(cipher, iv, key);
    const result = buildFile({
        salt,
        hmac,
        iv,
        cipher,
    });
    const decryptable = await checkBack(buffer, result.buffer, password);
    if (!decryptable) {
        throw new Error('Unable to decrypt file back');
    }
    return result;
}

/**
 * Encrypt a file using a password
 * @param file File to be encrypted
 * @param password Password used for encryption
 * @returns A promise that resolves to the encrypted file as a Uint8Array
 */
export async function encryptFile(file: File, password: string): Promise<Uint8Array> {
    const buffer = await readAsArrayBuffer(file);
    if (buffer.byteLength === 0) {
        throw new Error('The file is empty');
    }
    return encryptBuffer(buffer, password);
}

/**
 * Parse file data with password
 * @param buffer File data
 * @param password Password used for encryption
 * @returns A promise that resolves to an object containing the parsed file
 */
export async function parse(buffer: ArrayBufferLike, password: string): Promise<{
    hmac: lib.WordArray;
    iv: lib.WordArray;
    cipher: lib.CipherParams;
    key: lib.WordArray;
}> {
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
 * Decrypt a file data with password
 * @param buffer Processed file data
 * @param password Password
 * @returns A promise that resolves to the decrypted file data as a Uint8Array
 */
export async function decryptBuffer(buffer: ArrayBufferLike, password: string): Promise<Uint8Array> {
    if (buffer.byteLength === 0) {
        throw new Error('The buffer is empty');
    }
    const { key, hmac, iv, cipher } = await parse(buffer, password);
    if (calcHMAC(cipher, iv, key).toString() !== hmac.toString()) {
        throw new Error("The HMAC isn't correct");
    }
    const data = AES.decrypt(cipher, key, { iv });
    return wordArrayToUint8Array(data);
}

/**
 * Decrypt a file with password
 * @param file Processed file
 * @param password Password
 * @returns A promise that resolves to the decrypted file as a Uint8Array
 */
export async function decryptFile(file: File, password: string): Promise<Uint8Array> {
    const buffer = await readAsArrayBuffer(file);
    if (buffer.byteLength === 0) {
        throw new Error('The file is empty');
    }
    return decryptBuffer(buffer, password);
}

/**
 * Crypt a file with password
 * @param action Type of an action
 * @param file Processed file
 * @param password Password
 * @returns A promise that resolves to the encrypted or decrypted file as a Uint8Array
 */
export async function cryptFile(
    action: Action,
    file: File,
    password: string
): Promise<Uint8Array> {
    switch (action) {
        case 'encrypt':
            return encryptFile(file, password);
        case 'decrypt':
            return decryptFile(file, password);
        default:
            throw new Error('The action is not encrypt or decrypt');
    }
}

