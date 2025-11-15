import { ParsedVersion, ValidationResult, Version } from './interfaces';
import { FILE_EXTENSION_MAX_LENGTH, FILE_NAME_MAX_LENGTH, MAX_FILES_SIZE_MB } from './constants';

/**
 * Parses a version string into a tuple.
 * @param str The version string to parse, in the format 'major.minor.revision'.
 * @returns The parsed version tuple, or throws an error if the version string is invalid.
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
 * Uploads file by the system dialog.
 * @param type File type.
 * @returns A promise that resolves to the selected file.
 */
export async function upload(type?: string): Promise<File> {
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
 * Downloads file.
 * @param data Blob data.
 * @param fileName Name string.
 */
export function download(data: Blob, fileName: string): void {
    const anchor = document.createElement('a');
    anchor.href = window.URL.createObjectURL(data);
    anchor.download = fileName;
    anchor.click();
}

/**
 * Hides the middle part of the string under an ellipsis.
 * @param text String.
 * @param maxLength Max length of the string.
 * @returns Ellipsed string.
 */
export function ellipse(text: string, maxLength: number): string {
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
 * Validates a file to ensure it meets the required criteria.
 * @param file The file to be validated.
 * @returns True if the file is valid, or an error message if it's not.
 */
export function validateFile(file: File): ValidationResult {
    const { name, extension } = parseFileName(file.name);

    if (!name.length) {
        return 'File name is required.';
    }

    if (name.length > FILE_NAME_MAX_LENGTH) {
        return 'File name is too long.';
    }

    if (extension && extension.length > FILE_EXTENSION_MAX_LENGTH) {
        return 'File extension is too long.';
    }

    if (file.size === 0) {
        return 'Folders and empty files are not allowed.';
    }

    if (file.size > MAX_FILES_SIZE_MB * 1024 * 1024) {
        return `The file must be no more than ${MAX_FILES_SIZE_MB}MB.`;
    }

    return true;
}

/**
 * Validates a list of files to ensure it meets the required criteria.
 * @param files The list of files to be validated.
 * @returns An error message if validation fails, or true if validation succeeds.
 */
export function validateFiles(files: FileList): ValidationResult {
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
 * Validates a disguise file to ensure it meets the required criteria.
 * @param disguiseFile The disguise file to be validated.
 * @param sourceFile The source file associated with the disguise file.
 * @returns True if the disguise file is valid, or an error message if it's not.
 */
export function validateDisguise(disguiseFile: File, sourceFile: File): ValidationResult {
    const { name: disguiseFileName } = parseFileName(disguiseFile.name);

    if (!disguiseFileName.length) {
        return 'File name is required.';
    }

    if (disguiseFile.size === 0) {
        return 'Folders and empty files are not allowed.';
    }

    if (disguiseFile.size > MAX_FILES_SIZE_MB * 1024 * 1024) {
        return `The file must be no more than ${MAX_FILES_SIZE_MB}MB.`;
    }

    if (sourceFile.size + disguiseFile.size > MAX_FILES_SIZE_MB * 1024 * 1024) {
        return `The file and disguise must be no more than ${MAX_FILES_SIZE_MB}MB in total.`;
    }

    return true;
}

/**
 * Waits for a certain amount of time.
 * @param interval Time interval in ms.
 * @returns A promise that resolves after the specified interval.
 */
export function wait(interval: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, interval);
    });
}

/**
 * Parses a file name into its name and extension.
 * @param fileName The file name to be parsed.
 * @returns An object containing the name and extension.
 */
export function parseFileName(fileName: string): {
    name: string;
    extension?: string;
} {
    const match = fileName.match(/^(.*?)(?:\.([^.]+))?\.?$/);
    return {
        name: match?.[1] || '',
        extension: match?.[2] || undefined,
    };
}

/**
 * Adds a file extension to a given file name.
 * @param name The original file name.
 * @param extension The extension to add.
 * @returns The file name with the added extension.
 */
export function addExtension(name: string, extension?: string): string {
    return extension ? `${name}.${extension}` : name;
}

/**
 * Changes the file extension of a given file name.
 * @param name The original file name.
 * @param extension The new file extension.
 * @returns The file name with the new extension.
 */
export function changeExtension(name: string, extension?: string): string {
    return name.replace(/(\.[^.]*$|$)/, extension ? `.${extension}` : '');
}

/**
 * Removes trailing slashes from a given path.
 * @remarks Does not remove the leading slash, even if there is only one.
 * @param path The path from which trailing slashes will be removed.
 * @returns The path with trailing slashes removed.
 */
export function removeTrailingSlashes(path: string) {
    return path.replace(/(?<=.)\/+$/g, '');
}