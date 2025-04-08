import { parseVersion } from './common';
import { IStep, Version } from './interfaces';

// Version size in bytes
export const VERSION_SIZE = 3;

// Web application version ('major.minor.revision')
// Warning! No letters! Only numbers! No greater than 1 byte (0-255) for each number
// Don't forget to sync with the package.json
export const VERSION: Version = '0.0.1';

// Version parsed into the tuple ([major, minor, revision])
export const PARSED_VERSION = parseVersion(VERSION, VERSION_SIZE);

// Minimum password length
export const MIN_PASSWORD_LENGTH = 8;

// Maximum password length
export const MAX_PASSWORD_LENGTH = 127;

// Max file size in MB
export const MAX_FILE_SIZE_MB = 10;

// Maximum length of the file name inside the alert
export const MAX_ALERT_FILENAME_LENGTH = 30;

// TODO: Is it redundant?
export const enum PATH {
    UPLOAD = '/',
    KEY = '/password',
    SUCCESS = '/success',
}

export const enum STAGE {
    UPLOAD = 'upload',
    KEY = 'key',
    SUCCESS = 'success',
}

// TODO: Is it redundant?
export const PATH_STAGE: Record<PATH, STAGE> = {
    [PATH.UPLOAD]: STAGE.UPLOAD,
    [PATH.KEY]: STAGE.KEY,
    [PATH.SUCCESS]: STAGE.SUCCESS,
}

export const STAGE_DATA: Record<STAGE, IStep> = {
    [STAGE.UPLOAD]: {
        index: 0,
        text: 'Select file',
        color: '#009dff',
    },
    [STAGE.KEY]: {
        index: 1,
        text: 'Secure',
        color: '#00fff0',
    },
    [STAGE.SUCCESS]: {
        index: 2,
        text: 'Download',
        color: '#4aff90',
    },
};
