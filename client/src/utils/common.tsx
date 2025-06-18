import { ParsedVersion, ValidationResult, Version } from './interfaces';
import { MAX_FILE_SIZE_MB } from './constants';

/**
 * Parse a version string into a tuple
 * @param str The version string to parse, in the format 'major.minor.revision'
 * @return The parsed version tuple, or throws an error if the version string is invalid
 */
export function parseVersion(str: Version, size: number): ParsedVersion {
    const version = str.split('.').map(Number);
    // No letters, only numbers
    // No more than 1 byte (0-255) for each number
    if (version.length !== size || version.some((v) => v < 0 || v > 255)) {
        throw new Error('Invalid application version');
    }
    return version as ParsedVersion;
}

/**
 * Upload file by the system dialog
 */
export async function upload(type?: string) {
    return new Promise<File>((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        if (type) {
            input.accept = type;
        }
        input.click();
        input.onchange = (event) => resolve((event.target as HTMLInputElement).files![0]);
        input.onerror = (error) => reject(error);
    });
}

/**
 * Download file
 * @param data Blob data
 * @param fileName Name string
 */
export function download(data: Blob, fileName: string) {
    const anchor = document.createElement('a');
    anchor.href = window.URL.createObjectURL(data);
    anchor.download = fileName;
    anchor.click();
}

/**
 * Hide the end of the string under an ellipsis
 * @param text String
 * @param maxLength Max length of the string
 */
export function ellipse(text: string, maxLength: number) {
    if (text.length > maxLength) {
        const maxLengthWithDots = maxLength - 3;
        const ellipsis = '...';
        if (maxLengthWithDots <= 0) {
            return ellipsis;
        }
        return (
            text.slice(0, Math.ceil(maxLengthWithDots / 2)) +
            ellipsis +
            text.slice(-Math.floor(maxLengthWithDots / 2))
        );
    }
    return text;
}

/**
 * Check one file
 * @param file File
 */
export function validateFile(file: File): ValidationResult {
    if (file.size === 0) {
        return 'Folders and empty files are not allowed.';
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return <>The file must be no more than {MAX_FILE_SIZE_MB}&nbsp;MB.</>;
    }

    return true;
}

/**
 * Check file list
 * @param files File list
 */
export function validateFiles(files: FileList) {
    const length = files.length;

    if (length < 1) {
        return 'At least one file is required.';
    }

    if (length > 1) {
        return 'No more than one file at a time.';
    }

    const file = files[0];
    return validateFile(file);
}

/**
 * Wait for a certain amount of time
 * @param interval In ms
 */
export function wait(interval: number) {
    return new Promise((resolve) => setTimeout(resolve, interval));
}
