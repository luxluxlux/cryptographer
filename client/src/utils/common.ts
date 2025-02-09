import { MAX_FILE_SIZE_MB } from './constants';

/**
 * Upload file by the system dialog
 */
export async function upload() {
    return new Promise<File>((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
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
 * TODO Adapt to particular width
 * @param text String
 * @param maxLength Max length of the string
 */
export function ellipse(text: string, maxLength: number) {
    return text.length > maxLength ? (text.slice(0, maxLength / 2) + '...' + text.slice(-maxLength / 2)) : text;
}

/**
 * Check one file
 * @param file File
 */
export function validateFile(file: File) {
    if (file.size === 0) {
        return `Folders and empty files are not allowed.`;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return `The file must be no more than ${MAX_FILE_SIZE_MB} MB.`;
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
