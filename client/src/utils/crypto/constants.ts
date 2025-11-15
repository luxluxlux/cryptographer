import { algo, mode, pad, format, lib } from 'crypto-js';
import { FILE_EXTENSION_SIZE_SIZE_BYTES, FILE_NAME_SIZE_SIZE_BYTES, VERSION_SIZE } from 'utils/constants';
import { FixedBodyFormat, FixedFileFormat } from './interfaces';

/**
 * Salt size in bytes.
 * @remarks The selected value is based on the recommended params.
 * @see https://en.wikipedia.org/wiki/PBKDF2
 */
export const SALT_SIZE = 16;

/**
 * Initialization vector (IV) size in bytes.
 * @remarks The vector size is determined by AES in CBC mode. In that case IV must have the same
 * length as the block. AES uses 128-bit blocks, so a 128-bit IV.
 * @see https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#CBC
 */
export const IV_SIZE = 16;

/**
 * Key size in words (32 bits each).
 * @remarks The chosen method is based on recommended parameters and the fact that modern PC
 * processors are increasingly built on 64-bit architecture, while attackers use GPUs, which are
 * poor at 64-bit arithmetic.
 * @see https://www.keylength.com/
 */
export const KEY_SIZE = 16;

/**
 * Count of iterations of key hash function.
 * @remarks The selected value may seem outdated, but we use it to ensure stable operation for weak
 * clients.
 * @see https://en.wikipedia.org/wiki/PBKDF2
 */
export const KEY_ITERATIONS = 5000;

/**
 * Default cipher parameters.
 */
export const DEFAULT_CIPHER_PARAMS: Partial<lib.CipherParams> = {
    algorithm: algo.AES,
    // @ts-expect-error CBC mode TypeScript error
    mode: mode.CBC,
    padding: pad.Pkcs7,
    blockSize: 4,
    formatter: format.OpenSSL
};

/**
 * Format of the data body to be encrypted.
 * ```
 * Bytes | Description 
 * ------+-------------------------------
 *     2 | File name size (n)
 *     2 | File extension size (m)
 *     n | File name
 *     m | File extension
 *     . | Cipher
 * ```
 */
export const BODY_FORMAT: FixedBodyFormat = [
    {
        type: 'Uint8Array',
        calcSize: FILE_NAME_SIZE_SIZE_BYTES
    },
    {
        type: 'Uint8Array',
        calcSize: FILE_EXTENSION_SIZE_SIZE_BYTES
    },
];

/**
 * Format of the crypted file.
 * Attention! The file is read from the end, because it can be a polyglot file.
 * @see https://en.wikipedia.org/wiki/Polyglot_(computing)
 * ```
 * Bytes | Description 
 * ------+-------------------------------
 *     . | Disguise
 *     n | Body
 *     4 | Body size (n)
 *    16 | IV
 *    64 | HMAC (HmacSHA512)
 *    16 | Salt
 *     3 | Version (major, minor, revision)
 * ```
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
        size: 64
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

