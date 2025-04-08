import { algo, mode, pad, format, lib } from 'crypto-js';
import { VERSION_SIZE } from 'utils/constants';
import { FixedFileFormat } from './interfaces';

// Salt size in bytes
export const SALT_SIZE = 16;

// Initialization vector size in bytes
export const IV_SIZE = 16;

// Key size in words
export const KEY_SIZE = 8;

// Count of iterations of key hash function
export const KEY_ITERATIONS = 1000;

// Default cipher parameters
export const DEFAULT_CIPHER_PARAMS: Partial<lib.CipherParams> = {
    algorithm: algo.AES,
    // @ts-expect-error CBC mode TypeScript error
    mode: mode.CBC,
    padding: pad.Pkcs7,
    blockSize: 4,
    formatter: format.OpenSSL
};

/**
 * Format of the crypted file
 * Attention! The file is read from the end, because it can be a polyglot file
 * https://en.wikipedia.org/wiki/Polyglot_(computing)
 * 
 * Bytes | Description 
 * ------+-------------------------------
 *     . | Unknown data
 *     n | Cipher
 *     4 | Cipher size (n)
 *    16 | IV
 *    32 | HMAC (HmacSHA256)
 *    16 | Salt
 *     3 | Version (major, minor, revision)
 */
export const FILE_FORMAT: FixedFileFormat = [
    {
        type: 'WordArray',
        calcSize: 4
    },
    {
        type: 'WordArray',
        size: IV_SIZE
    },
    {
        type: 'WordArray',
        size: 32
    },
    {
        type: 'WordArray',
        size: SALT_SIZE
    },
    {
        type: 'Uint8Array',
        size: VERSION_SIZE
    },
];

