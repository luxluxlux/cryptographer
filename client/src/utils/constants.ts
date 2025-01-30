import { IStep } from './interfaces';

// Web application version - 3 characters separated by a dot, such as 0.1.0, 1.2.14, etc.
// Caution! Each single number of the version mustn't exceed the VERSION_SIZE
// FIXME Track it globally after https://github.com/luxluxlux/cryptographer/issues/35
export const VERSION = '0.0.0';
// Max size of the single number of the version in bits
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

// TODO Is it redundant?
export const enum PATH {
    UPLOAD = '/',
    KEY = '/password',
    SUCCESS = '/success',
    ERROR = '/failure',
}

export const enum STAGE {
    UPLOAD = 'upload',
    KEY = 'key',
    SUCCESS = 'success',
    ERROR = 'error',
}

// TODO Is it redundant?
export const PATH_STAGE: Record<PATH, STAGE> = {
    [PATH.UPLOAD]: STAGE.UPLOAD,
    [PATH.KEY]: STAGE.KEY,
    [PATH.SUCCESS]: STAGE.SUCCESS,
    [PATH.ERROR]: STAGE.ERROR,
}

export const STAGE_DATA: Record<STAGE, IStep> = {
    [STAGE.UPLOAD]: {
        index: 0,
        text: 'Select file',
        color: '#009dff',
    },
    [STAGE.KEY]: {
        index: 1,
        text: 'Enter the key',
        color: '#00fff0',
    },
    [STAGE.SUCCESS]: {
        index: 2,
        text: 'Download',
        color: '#4aff87',
    },
    [STAGE.ERROR]: {
        color: '#ff2600',
    },
};

export const enum WINDOW {
    ABOUT = 'about',
    HOW_IT_WORKS = 'how_it_works',
}

// Max length of the file name before the ellipsis
export const MAX_ELLIPSED_FILENAME_LENGTH = 42;