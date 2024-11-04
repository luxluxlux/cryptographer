import { AES, PBKDF2, HmacSHA256, lib, enc } from 'crypto-js';

/**
 * Extract data as ArrayBuffer from file
 */
async function readAsArrayBuffer(file: File) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = error => reject(error);
    });
}

/**
 * Extract data as string from file
 */
async function readAsText(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

/**
 * Convert WordArray to native Uint8Array
 * TODO Maybe it's a good idea to use TextEncoder, but there are a lot of difficulties have to do
 * with the encoding detection. At least this solution is faster.
 */
function wordArrayToUint8Array(wordArray: lib.WordArray) {
    const length = wordArray.sigBytes;
    const arr = new Uint8Array(length);
    for (let i = 0, j = 0; i < length; i++) {
        const word = wordArray.words[i];
        arr[j++] = word >> 24;
        arr[j++] = (word >> 16) & 0xff;
        arr[j++] = (word >> 8) & 0xff;
        arr[j++] = word & 0xff;
    }
    return arr;
}

/**
 * Generate random salt
 */
export function generateSalt() {
    return lib.WordArray.random(128 / 8);
}

/**
 * Get key for cryption
 * FIXME Genereate salt inside if necessary
 * @param key Secret key ot password
 * @param salt Salt if necessary
 */
function getHashedKey(key: lib.WordArray | string, salt: lib.WordArray) {
    return typeof key === 'string' ? PBKDF2(key, salt, {
        // TODO Get size from the config
        keySize: 256 / 32,
        iterations: 1000
    }) : key;
}

/**
 * Generate secret key
 * TODO Probably generate by the mouse moving
 */
export function generateSecretKey() {
    // TODO Maybe make it longer
    return lib.WordArray.random(512 / 8);
}

/**
 * Parse secretKey from file
 * @param file Processed file
 */
export async function parseSecretKey(file: File) {
    const text = await readAsText(file);
    return enc.Hex.parse(text);
}

/**
 * Encrypt a file by secret data
 * @param file Processed file
 * @param key Secret key ot password
 */
export async function encrypt(file: File, key: lib.WordArray | string): Promise<BlobPart> {
    const salt = generateSalt();
    const hashedkey = getHashedKey(key, salt);
    const arrBuffer = await readAsArrayBuffer(file);
    const wordArray = lib.WordArray.create(arrBuffer);
    // TODO Get size from the config
    const iv = lib.WordArray.random(128 / 8);
    const data = AES.encrypt(wordArray, hashedkey, { iv });
    const dataStr = data.toString();
    const hmac = HmacSHA256(dataStr, hashedkey);
    // FIXME Don't include the salt in a secretKey mode
    return salt.toString() + iv.toString() + hmac.toString() + dataStr;
}

/**
 * Decrypt a file by secret data
 * @param file Processed file
 * @param key Secret key ot password
 */
export async function decrypt(file: File, key: lib.WordArray | string): Promise<BlobPart> {
    const text = await readAsText(file);
    // FIXME Don't generate the salt in a secretKey mode
    // TODO Get positions from the config
    const salt = enc.Hex.parse(text.slice(0, 32));
    const hashedkey = getHashedKey(key, salt);
    const iv = enc.Hex.parse(text.slice(32, 64));
    const hmac = enc.Hex.parse(text.slice(64, 128));
    const dataStr = text.slice(128);
    if (HmacSHA256(dataStr, hashedkey).toString() !== hmac.toString()) {
        throw new Error("The HMAC isn't correct");
    }
    const data = AES.decrypt(dataStr, hashedkey, { iv });
    return wordArrayToUint8Array(data);
}

/**
 * Crypt a file by a secret data
 * @param action Type of an action
 */
export async function crypt(action: 'encrypt' | 'decrypt', ...args: [File, lib.WordArray | string]) {
    switch (action) {
        case 'encrypt':
            return encrypt(...args);
        case 'decrypt':
            return decrypt(...args);
    }
}


