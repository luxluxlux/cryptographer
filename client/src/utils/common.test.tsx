import { isValidElement } from 'react';
import { ellipse, parseVersion, validateFile, validateFiles, wait } from './common';
import { MAX_FILE_SIZE_MB } from './constants';
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

    it('Should return an error message for an empty file', () => {
        const file = new File([], 'empty.txt', { type: 'text/plain' });
        const result = validateFile(file);
        expect(typeof result === 'string' || isValidElement(result)).toEqual(true);
    });

    it('Should return an error message for a file larger than MAX_FILE_SIZE_MB', () => {
        const largeContent = new Uint8Array((MAX_FILE_SIZE_MB + 1) * 1024 * 1024);
        const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
        const result = validateFile(file);
        expect(typeof result === 'string' || isValidElement(result)).toEqual(true);
    });
});

describe('validateFiles', () => {
    it('Should return an error message for an empty file list', () => {
        // JSDOM doesn't support DataTransfer
        // https://github.com/jsdom/jsdom/issues/1568
        const result = validateFiles([] as unknown as FileList);
        expect(typeof result === 'string' || isValidElement(result)).toEqual(true);
    });

    it('Should return an error message for a list of files with more than one element', () => {
        const file = new File(['Hello'], 'test.txt', { type: 'text/plain' });
        // JSDOM doesn't support DataTransfer
        // https://github.com/jsdom/jsdom/issues/1568
        const fileList = [file, file] as unknown as FileList;
        const result2 = validateFiles(fileList);
        expect(typeof result2 === 'string' || isValidElement(result2)).toEqual(true);
    });

    it('Should return true for a single file', () => {
        const file = new File(['Hello'], 'test.txt', { type: 'text/plain' });
        // JSDOM doesn't support DataTransfer
        // https://github.com/jsdom/jsdom/issues/1568
        const fileList = [file] as unknown as FileList;
        const result = validateFiles(fileList);
        expect(result).toEqual(true);
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
