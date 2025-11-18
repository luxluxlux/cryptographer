import { AES, PBKDF2, HmacSHA512, lib } from 'crypto-js';
import { ValidationResult } from 'utils/interfaces';
import { MAX_FILES_SIZE_MB, PARSED_VERSION } from 'utils/constants';
import { parseFileName, validateDisguise, validateFile } from 'utils/common';
import {
    assemble,
    disassemble,
    concatWordArrays,
    wordArrayToUint8Array,
    stringToUint8Array,
    compareUint8Arrays,
    compareWordArrays,
    readAsUint8Array,
    uint8ArrayToString,
} from './utils';
import {
    IV_SIZE,
    KEY_ITERATIONS,
    KEY_SIZE,
    SALT_SIZE,
    DEFAULT_CIPHER_PARAMS,
    FILE_FORMAT,
    BODY_FORMAT
} from './constants';

/**
 * Generates random salt.
 * @returns Randomly generated salt.
 */
export function generateSalt(): lib.WordArray {
    return lib.WordArray.random(SALT_SIZE);
}

/**
 * Generates random initialization vector (IV).
 * @returns Randomly generated initialization vector (IV).
 */
export function generateIV(): lib.WordArray {
    return lib.WordArray.random(IV_SIZE);
}

/**
 * Derives key from password and salt.
 * @param password Password to be derived.
 * @param salt Salt to be used.
 * @returns Derived key.
 */
export function getKey(password: string, salt: lib.WordArray): lib.WordArray {
    return PBKDF2(password, salt, {
        keySize: KEY_SIZE,
        iterations: KEY_ITERATIONS,
    });
}

/**
 * Calculates HMAC of the encrypted data.
 * @param data Encrypted data.
 * @param iv Initialization vector (IV).
 * @param key Hashed key.
 * @returns HMAC of the encrypted data.
 */
export function calcHMAC(data: lib.CipherParams, iv: lib.WordArray, key: lib.WordArray): lib.WordArray {
    // The chosen method is based on recommended parameters (https://www.keylength.com/)
    // and the fact that modern PC processors are increasingly built on 64-bit architecture,
    // which works faster with SHA512, while attackers use GPUs, which are poor at 64-bit arithmetic
    return HmacSHA512(concatWordArrays(data.ciphertext, iv), key);
}

/**
 * Builds the body of an encrypted file.
 * @param options The options for building the body.
 * @param options.name The name of the file to be encrypted.
 * @param options.extension The extension of the file to be encrypted.
 * @param options.data The data to be encrypted.
 * @returns The assembled body of the encrypted file.
 */
export function buildBody({
    name,
    extension,
    data
}: {
    name?: string,
    extension?: string,
    data: Uint8Array
}): Uint8Array {
    return assemble(BODY_FORMAT,
        [
            extension ? stringToUint8Array(extension) : new Uint8Array(),
            name ? stringToUint8Array(name) : new Uint8Array(),
        ],
        data,
    );
}

/**
 * Builds file by encrypted data.
 * @param options The options for building the file.
 * @param options.salt Salt used during encryption.
 * @param options.hmac HMAC of the encrypted data.
 * @param options.iv Initialization vector.
 * @param options.cipher Cipher parameters containing the ciphertext.
 * @param options.disguise Disguise data.
 * @returns Concatenated Uint8Array representing the encrypted file.
 */
export function buildFile({
    salt,
    hmac,
    iv,
    cipher,
    disguise
}: {
    salt: lib.WordArray,
    hmac: lib.WordArray,
    iv: lib.WordArray,
    cipher: lib.CipherParams,
    disguise?: Uint8Array
}): Uint8Array {
    return assemble(FILE_FORMAT,
        [
            cipher.ciphertext,
            iv,
            hmac,
            salt,
            new Uint8Array(PARSED_VERSION),
        ],
        disguise,
        true
    );
}

/**
 * Checks if the decrypted data matches the original data.
 * @param source The original data to compare with.
 * @param encrypted The encrypted data to decrypt and compare.
 * @param password The password used for decryption.
 * @returns A promise that resolves to true if the decrypted data matches the original data, false otherwise.
 */
export async function checkBack(source: Uint8Array, encrypted: Uint8Array, password: string): Promise<boolean> {
    const decrypted = (await decryptData(encrypted, password)).data;
    return compareUint8Arrays(source, decrypted);
}

/**
 * Encrypts a file using a password.
 * @param sourceFile File to be encrypted.
 * @param password Password used for encryption.
 * @param disguiseFile File as a disguise.
 * @returns A promise that resolves to the encrypted file as a Uint8Array.
 */
export async function encryptFile(sourceFile: File, password: string, disguiseFile?: File): Promise<Uint8Array> {
    const sourceFileValidation = validateFile(sourceFile);
    if (sourceFileValidation !== true) {
        throw new Error(sourceFileValidation);
    }

    const diguiseFileValidation = disguiseFile && validateDisguise(disguiseFile, sourceFile);
    if (diguiseFileValidation && diguiseFileValidation !== true) {
        throw new Error(diguiseFileValidation);
    }

    const salt = generateSalt();
    const key = getKey(password, salt);
    const iv = generateIV();
    const source = await readAsUint8Array(sourceFile);
    const { name: fileName, extension: fileExtension } = parseFileName(sourceFile.name);
    const body = buildBody({
        // We only store the file name if we mask it
        name: disguiseFile ? fileName : undefined,
        extension: fileExtension,
        data: source
    })
    const data = lib.WordArray.create(body);
    const cipher = AES.encrypt(data, key, { iv });
    const hmac = calcHMAC(cipher, iv, key);
    const disguise = disguiseFile && await readAsUint8Array(disguiseFile);
    const result = buildFile({ salt, hmac, iv, cipher, disguise });

    const decryptable = await checkBack(source, result, password);
    if (!decryptable) {
        throw new Error('Unable to decrypt file back');
    }

    return result;
}

/**
 * Validates the decrypted data to ensure it meets the required criteria.
 * @param data The decrypted data to be validated.
 * @returns True if the data is valid, or an error message if it's not.
 */
export function validateDecryptedData(data: Uint8Array): ValidationResult {
    if (data.length === 0) {
        return 'The data is empty.';
    }

    if (data.length > MAX_FILES_SIZE_MB * 1024 * 1024) {
        return `The data must be no more than ${MAX_FILES_SIZE_MB}MB.`;
    }

    return true;
}

/**
 * Parses file data with password.
 * @param data File data.
 * @param password Password used for encryption.
 * @returns A promise that resolves to an object containing the parsed file.
 */
export async function parseFile(data: Uint8Array, password: string): Promise<{
    hmac: lib.WordArray;
    iv: lib.WordArray;
    cipher: lib.CipherParams;
    key: lib.WordArray;
}> {
    const { formattedData: [ciphertext, iv, hmac, salt, _version] } = disassemble(FILE_FORMAT, data, true);
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
 * Parses the body of an encrypted file into its constituent parts.
 * @param body The body of the encrypted file to parse.
 * @returns A promise that resolves to an object containing the parsed body.
 */
export async function parseBody(body: Uint8Array): Promise<{
    name?: string;
    extension?: string;
    data: Uint8Array;
}> {
    const { formattedData: [extension, name], additionalData: data } = disassemble(BODY_FORMAT, body);
    return {
        name: name.length ? uint8ArrayToString(name) : undefined,
        extension: extension.length ? uint8ArrayToString(extension) : undefined,
        data: data!,
    };
}

/**
 * Decrypts a file data with password.
 * @param data Processed file data.
 * @param password Password.
 * @returns A promise that resolves to the decrypted file data as a Uint8Array.
 */
export async function decryptData(data: Uint8Array, password: string): Promise<{
    name?: string;
    extension?: string;
    data: Uint8Array;
}> {
    const validation = validateDecryptedData(data);
    if (validation !== true) {
        throw new Error(validation);
    }

    const { key, hmac, iv, cipher } = await parseFile(data, password);
    if (!compareWordArrays(calcHMAC(cipher, iv, key), hmac)) {
        throw new Error("The HMAC isn't correct");
    }
    const body = wordArrayToUint8Array(AES.decrypt(cipher, key, { iv }));
    return await parseBody(body);
}

/**
 * Decrypts a file with password.
 * @param file Processed file.
 * @param password Password.
 * @returns A promise that resolves to the decrypted file as a Uint8Array.
 */
export async function decryptFile(file: File, password: string): Promise<{
    name?: string;
    extension?: string;
    data: Uint8Array;
}> {
    const validation = validateFile(file);
    if (validation !== true) {
        throw new Error(validation);
    }

    const data = await readAsUint8Array(file);
    return decryptData(data, password);
}
