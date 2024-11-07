// Web application version - 3 characters separated by a dot, such as 0.1.0, 1.2.14, etc.
// Caution! Each single number of the version mustn't exceed the VERSION_SIZE
// FIXME Track it globally after https://github.com/luxluxlux/cryptographer/issues/35
export const VERSION = '0.0.0';
// Max size of the single part of the version in bits
export const VERSION_SIZE = 16;

// TODO Make a config and get this params from it
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 127;

// Salt size in bits
export const SALT_SIZE = 128;

// Initialization vector size in bits
export const IV_SIZE = 128;

// Key size in bits
export const KEY_SIZE = 256;

// Count of iterations of key hash function
export const KEY_ITERATIONS = 1000;

// Secret key size in bits
export const SECRET_KEY_SIZE = 512;
