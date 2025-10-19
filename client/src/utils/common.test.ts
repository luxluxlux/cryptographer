import {
    addExtension,
    changeExtension,
    ellipse,
    parseFileName,
    parseVersion,
    validateDisguise,
    validateFile,
    validateFiles,
    wait,
} from './common';
import { FILE_EXTENSION_MAX_LENGTH, FILE_NAME_MAX_LENGTH, MAX_FILES_SIZE_MB } from './constants';
import { Version } from './interfaces';

describe('parseVersion', () => {
    it('Should parse a version string into a tuple', () => {
        const version = '1.2.3';
        const parsedVersion = parseVersion(version, 3);
        expect(parsedVersion).toEqual([1, 2, 3]);
    });

    it('Should throw an error if the version string is invalid', () => {
        const invalidVersion = '1.2' as Version;
        expect(() => parseVersion(invalidVersion, 3)).toThrow();
    });

    it('Should throw an error if the version contains a number greater than 255 (1 byte)', () => {
        const invalidVersion = '256.0.0' as Version;
        expect(() => parseVersion(invalidVersion, 3)).toThrow();
    });
});

describe('ellipse', () => {
    it('Should return the original string if its length is less than maxLength', () => {
        const text = 'Hello';
        const maxLength = 10;
        expect(ellipse(text, maxLength)).toEqual(text);
    });

    it('Should return a string with ellipsis if it exceeds maxLength', () => {
        const text = 'Hello, World!';
        const maxLength = 10;
        expect(ellipse(text, maxLength)).toEqual('Hell...ld!');
    });

    it('Should handle exact length strings by not adding ellipsis', () => {
        const text = 'HelloWorld';
        const maxLength = 10;
        expect(ellipse(text, maxLength)).toEqual(text);
    });

    it('Should return an empty string if maxLength is less than or equal to 3', () => {
        const text = 'Hello';
        const maxLength = 3;
        expect(ellipse(text, maxLength)).toEqual('...');
    });
});

describe('validateFile', () => {
    it('Should return true for a valid file', () => {
        const file = new File(['Hello'], 'test.txt', { type: 'text/plain' });
        expect(validateFile(file)).toEqual(true);
    });

    it('Should return true for a valid file without an extension', () => {
        const file = new File(['Hello'], 'test', { type: 'text/plain' });
        expect(validateFile(file)).toEqual(true);
    });

    it('Should return an error message for a file without a name', () => {
        const file = new File(['Hello'], '.txt', { type: 'text/plain' });
        const result = validateFile(file);
        expect(typeof result === 'string').toEqual(true);
    });

    it('Should return an error message for an empty file', () => {
        const file = new File([], 'empty.txt', { type: 'text/plain' });
        const result = validateFile(file);
        expect(typeof result === 'string').toEqual(true);
    });

    it('Should return an error message for a file larger than MAX_FILE_SIZE_MB', () => {
        const largeContent = new Uint8Array((MAX_FILES_SIZE_MB + 1) * 1024 * 1024);
        const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
        const result = validateFile(file);
        expect(typeof result === 'string').toEqual(true);
    });

    it('Should return an error message for a file with a name longer than FILE_NAME_MAX_LENGTH', () => {
        const file = new File(['Hello'], new Array(FILE_NAME_MAX_LENGTH + 2).join('a'), {
            type: 'text/plain',
        });
        const result = validateFile(file);
        expect(typeof result === 'string').toEqual(true);
    });

    it('Should return an error message for a file with an extension longer than FILE_EXTENSION_MAX_LENGTH', () => {
        const file = new File(
            ['Hello'],
            'test.' + new Array(FILE_EXTENSION_MAX_LENGTH + 2).join('a'),
            { type: 'text/plain' }
        );
        const result = validateFile(file);
        expect(typeof result === 'string').toEqual(true);
    });
});

describe('validateFiles', () => {
    it('Should return true for a single file', () => {
        const file = new File(['Hello'], 'test.txt', { type: 'text/plain' });
        // JSDOM doesn't support DataTransfer
        // https://github.com/jsdom/jsdom/issues/1568
        const fileList = [file] as unknown as FileList;
        const result = validateFiles(fileList);
        expect(result).toEqual(true);
    });

    it('Should return an error message for an empty file list', () => {
        // JSDOM doesn't support DataTransfer
        // https://github.com/jsdom/jsdom/issues/1568
        const result = validateFiles([] as unknown as FileList);
        expect(typeof result === 'string').toEqual(true);
    });

    it('Should return an error message for a list of files with more than one element', () => {
        const file = new File(['Hello'], 'test.txt', { type: 'text/plain' });
        // JSDOM doesn't support DataTransfer
        // https://github.com/jsdom/jsdom/issues/1568
        const fileList = [file, file] as unknown as FileList;
        const result2 = validateFiles(fileList);
        expect(typeof result2 === 'string').toEqual(true);
    });
});

describe('validateDisguise', () => {
    it('Should return true for a valid disguise file', () => {
        const file = new File(['Hello'], 'test.txt', { type: 'text/plain' });
        const disguise = new File(['Hello'], 'test.html', { type: 'text/html' });
        const result = validateDisguise(disguise, file);
        expect(result).toEqual(true);
    });

    it('Should return true for a valid disguise file without an extension', () => {
        const file = new File(['Hello'], 'test.txt', { type: 'text/plain' });
        const disguise = new File(['Hello'], 'test', { type: 'text/html' });
        const result = validateDisguise(disguise, file);
        expect(result).toEqual(true);
    });

    it('Should return an error message for a disguise file without a name', () => {
        const file = new File(['Hello'], '.txt', { type: 'text/plain' });
        const disguise = new File(['Hello'], '.html', { type: 'text/html' });
        const result = validateDisguise(disguise, file);
        expect(typeof result === 'string').toEqual(true);
    });

    it('Should return an error message for an empty disguise file', () => {
        const file = new File(['Hello'], 'test.txt', { type: 'text/plain' });
        const result = validateDisguise(new File([], 'empty.txt', { type: 'text/plain' }), file);
        expect(typeof result === 'string').toEqual(true);
    });

    it('Should return an error message for a disguise file larger than MAX_FILE_SIZE_MB', () => {
        const largeContent = new Uint8Array((MAX_FILES_SIZE_MB + 1) * 1024 * 1024);
        const file = new File(['Hello'], 'test.txt', { type: 'text/plain' });
        const disguise = new File([largeContent], 'large.txt', { type: 'text/plain' });
        const result = validateDisguise(disguise, file);
        expect(typeof result === 'string').toEqual(true);
    });

    it('Should return an error message for a file and a disguise file larger than MAX_FILES_SIZE_MB', () => {
        const largeContent = new Uint8Array((MAX_FILES_SIZE_MB + 1) * 1024 * 1024);
        const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
        const disguise = new File([largeContent], 'large.txt', { type: 'text/plain' });
        const result = validateDisguise(disguise, file);
        expect(typeof result === 'string').toEqual(true);
    });
});

describe('wait', () => {
    it('Should resolve after given interval', async () => {
        const startTime = performance.now();
        await wait(100);
        const endTime = performance.now();
        expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });
});

describe('parseFileName', () => {
    it('Should parse a file name into its name and extension', () => {
        const file = new File(['Hello'], 'test.txt', { type: 'text/plain' });
        const { name, extension } = parseFileName(file.name);
        expect(name).toEqual('test');
        expect(extension).toEqual('txt');
    });

    it('Should return undefined for the extension if there is no extension', () => {
        const file = new File(['Hello'], 'test', { type: 'text/plain' });
        const { extension } = parseFileName(file.name);
        expect(extension).toBeUndefined();
    });
});

describe('addExtension', () => {
    it('Should add the extension to the file name', () => {
        expect(addExtension('test', 'txt')).toEqual('test.txt');
    });

    it('Should add the extension even if the file name contains dots', () => {
        expect(addExtension('test.txt', 'txt')).toEqual('test.txt.txt');
    });

    it('Should not add the extension if it is not passed', () => {
        expect(addExtension('test')).toEqual('test');
    });
});

describe('changeExtension', () => {
    it('Should change the extension of the file name', () => {
        expect(changeExtension('test.txt', 'html')).toEqual('test.html');
    });

    it('Should remove the extension if an empty string is passed', () => {
        expect(changeExtension('test.txt', '')).toEqual('test');
    });

    it('Should not change the extension if it is not passed', () => {
        expect(changeExtension('test')).toEqual('test');
    });
});
