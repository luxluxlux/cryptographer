import { parseVersion } from './common';
import { IStep, Version } from './interfaces';

// Name of the application
export const APPLICATION_NAME = 'Cryptographer';

// Version size in bytes
export const VERSION_SIZE = 3;

// Web application version ('major.minor.revision')
// Warning! No letters! Only numbers! No greater than 1 byte (0-255) for each number
// Don't forget to sync with the package.json
export const VERSION: Version = '0.0.1';

// Version parsed into the tuple ([major, minor, revision])
export const PARSED_VERSION = parseVersion(VERSION, VERSION_SIZE);

// Project URL on GitHub
export const GITHUB_URL = 'https://github.com/luxluxlux/cryptographer';

// Minimum password length
export const MIN_PASSWORD_LENGTH = 8;

// Maximum password length
export const MAX_PASSWORD_LENGTH = 127;

// Maximum total size of uploaded files
export const MAX_FILES_SIZE_MB = 10;

// Size of reserved space for file name size in bytes
export const FILE_NAME_SIZE_SIZE_BYTES = 2;

// Maximum file name length (UTF-8 - 4 bytes per character)
export const FILE_NAME_MAX_LENGTH = 2 ** (8 * FILE_NAME_SIZE_SIZE_BYTES) / 4 - 1;

// Size of reserved space for file extension size in bytes
export const FILE_EXTENSION_SIZE_SIZE_BYTES = 2;

// Maximum file extension length (UTF-8 - 4 bytes per character)
export const FILE_EXTENSION_MAX_LENGTH = 2 ** (8 * FILE_EXTENSION_SIZE_SIZE_BYTES) / 4 - 1;

// Maximum length of the file name inside the alert
export const MAX_ALERT_FILENAME_LENGTH = 30;

// Encrypted file extension
export const FILE_EXTENSION = 'crg';

// Handling stages
export enum STAGE {
    UPLOAD = 'upload',
    SECURE = 'secure',
    DOWNLOAD = 'download',
}

// Data for stage render
export const STAGE_DATA: Record<STAGE, IStep> = {
    [STAGE.UPLOAD]: {
        path: '/',
        color: '#009dff',
    },
    [STAGE.SECURE]: {
        path: '/secure',
        color: '#00fff0',
    },
    [STAGE.DOWNLOAD]: {
        path: '/download',
        color: '#4aff90',
    },
};
