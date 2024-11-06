import { AES, PBKDF2, HmacSHA256, lib, enc } from 'crypto-js';
import { SALT_SIZE, IV_SIZE, KEY_SIZE, KEY_ITERATIONS, SECRET_KEY_SIZE } from './constants';

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
 * Calculate bytes size by bits
 * @param size Size in bits
 * @returns Size in bytes
 */
function bitsToBytes(size: number) {
    return size / 8;
}

/**
 * Calculate hex size by bits
 * Hex is used as the default toString() converter in crypto-js
 * @param size Size in bits
 * @returns Size in hex
 */
function bitsToHex(size: number) {
    return size / 4;
}

/**
 * Calculate crypto-js word count by bits
 * @param size Size in bits
 * @returns Word count
 */
function bitsToWords(size: number) {
    return size / 32;
}

/**
 * Convert WordArray to native Uint8Array
 * Maybe it's a good idea to use TextEncoder, but there are a lot of difficulties have to do
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
    return lib.WordArray.random(bitsToBytes(SALT_SIZE));
}

/**
 * Get key for cryption
 * @param key Secret key ot password
 * @param salt Salt if necessary
 */
function getHashedKey(key: lib.WordArray | string, salt: lib.WordArray) {
    return typeof key === 'string' ? PBKDF2(key, salt, {
        keySize: bitsToWords(KEY_SIZE),
        iterations: KEY_ITERATIONS
    }) : key;
}

/**
 * Generate secret key
 */
export function generateSecretKey() {
    return lib.WordArray.random(bitsToBytes(SECRET_KEY_SIZE));
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
 * Calculate HMAC
 */
function calcHMAC(data: lib.CipherParams | string, iv: lib.WordArray, key: lib.WordArray) {
    return HmacSHA256((typeof data === 'string' ? data : data.toString()) + iv.toString(), key);
}

/**
 * Build file by encrypted data
 * @returns Encrypted data
 */
function buildFile({
    salt,
    hmac,
    iv,
    data
}: {
    salt: lib.WordArray,
    hmac: lib.WordArray,
    iv: lib.WordArray,
    data: lib.CipherParams
}): BlobPart {
    // FIXME Don't include the salt in a secretKey mode
    return salt.toString() + hmac.toString() + iv.toString() + data.toString();
}

/**
 * Extract the substrings of different sizes
 * 'Text', [1, 2] > ['T', 'ex', 't']
 * @param str String
 * @param sizeArr Array of sizes
 * @returns Substrings array
 */
function substr(str: string, sizeArr: number[]) {
    let substrngs = [];
    let pos = 0;
    for (const size of sizeArr) {
        substrngs.push(str.slice(pos, pos + size));
        pos += size;
    }
    substrngs.push(str.slice(pos));
    return substrngs;
}

/**
 * Parse file with encrypted data
 * @param file Processed file
 */
async function parseFile(file: File) {
    const text = await readAsText(file);
    // We are using SHA256 for HMAC calulation
    const [saltStr, hmacStr, ivStr, data] = substr(text, [bitsToHex(SALT_SIZE), bitsToHex(256), bitsToHex(IV_SIZE)]);
    return {
        salt: enc.Hex.parse(saltStr),
        hmac: enc.Hex.parse(hmacStr),
        iv: enc.Hex.parse(ivStr),
        dataStr: data,
    }
}

/**
 * Encrypt a file by a secret data
 * @param file Processed file
 * @param key Secret key or password
 */
export async function encrypt(file: File, key: lib.WordArray | string): Promise<BlobPart> {
    const salt = generateSalt();
    const hashedkey = getHashedKey(key, salt);
    const iv = lib.WordArray.random(bitsToBytes(IV_SIZE));
    const arrBuffer = await readAsArrayBuffer(file);
    const wordArray = lib.WordArray.create(arrBuffer);
    const data = AES.encrypt(wordArray, hashedkey, { iv });
    const hmac = calcHMAC(data, iv, hashedkey);
    return buildFile({
        salt,
        hmac,
        iv,
        data,
    });
}

/**
 * Decrypt a file by a secret data
 * @param file Processed file
 * @param key Secret key or password
 */
export async function decrypt(file: File, key: lib.WordArray | string): Promise<BlobPart> {
    const { salt, hmac, iv, dataStr } = await parseFile(file);
    const hashedkey = getHashedKey(key, salt);
    if (calcHMAC(dataStr, iv, hashedkey).toString() !== hmac.toString()) {
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
