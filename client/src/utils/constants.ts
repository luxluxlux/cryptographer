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

// Max file size in MB
export const MAX_FILE_SIZE_MB = 10;

// Maximum length of the file name inside the alert
export const MAX_ALERT_FILENAME_LENGTH = 30;

export enum STAGE {
    UPLOAD = 'upload',
    KEY = 'key',
    SUCCESS = 'success',
}

// Data for stage render
export const STAGE_DATA: Record<STAGE, IStep> = {
    [STAGE.UPLOAD]: {
        path: '/',
        color: '#009dff',
    },
    [STAGE.KEY]: {
        path: '/password',
        color: '#00fff0',
    },
    [STAGE.SUCCESS]: {
        path: '/success',
        color: '#4aff90',
    },
};
