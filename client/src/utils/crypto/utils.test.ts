import { lib } from 'crypto-js';
import {
    assemble,
    concatUint8Arrays,
    concatWordArrays,
    customizeArr,
    disassemble,
    normalizeArr,
    numberToUint8Array,
    readAsArrayBuffer,
    uint8ArrayToNumber,
    wordArrayToUint8Array
} from './utils';
import { ArrType, FileFormat } from './interfaces';

describe('readAsArrayBuffer', () => {
    it('Should return a promise that resolves to an Uint8Array', async () => {
        const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
        const result = await readAsArrayBuffer(file);
        expect(result).toBeInstanceOf(ArrayBuffer);
        expect(result).toEqual(new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]).buffer);
    });
});

describe('numberToUint8Array', () => {
    it('Should return the correct Uint8Array', () => {
        expect(numberToUint8Array(1, 4)).toEqual(new Uint8Array([0, 0, 0, 1]));
        expect(numberToUint8Array(256, 4)).toEqual(new Uint8Array([0, 0, 1, 0]));
        expect(numberToUint8Array(65536, 4)).toEqual(new Uint8Array([0, 1, 0, 0]));
        expect(numberToUint8Array(16777216, 4)).toEqual(new Uint8Array([1, 0, 0, 0]));
    });

    it('Should throw an error if the number is larger than the array length', () => {
        expect(() => numberToUint8Array(4294967296, 4)).toThrow();
    });

    it('Should throw an error if the number is negative', () => {
        expect(() => numberToUint8Array(-1, 4)).toThrow();
    });

    it('Should throw an error if the array length is not greater than 0', () => {
        expect(() => numberToUint8Array(1, 0)).toThrow();
    });
});

describe('uint8ArrayToNumber', () => {
    it('Should return the correct number', () => {
        expect(uint8ArrayToNumber(new Uint8Array([0, 0, 0, 1]))).toEqual(1);
        expect(uint8ArrayToNumber(new Uint8Array([0, 0, 1, 0]))).toEqual(256);
        expect(uint8ArrayToNumber(new Uint8Array([0, 1, 0, 0]))).toEqual(65536);
        expect(uint8ArrayToNumber(new Uint8Array([1, 0, 0, 0]))).toEqual(16777216);
    });
});

describe('concatUint8Arrays', () => {
    it('Should return the concatenated array', () => {
        expect(concatUint8Arrays(new Uint8Array([1, 2]), new Uint8Array([3, 4]))).toEqual(new Uint8Array([1, 2, 3, 4]));
    });
});

describe('wordArrayToUint8Array', () => {
    it('Should return the correct Uint8Array', () => {
        const wordArr = lib.WordArray.create([0x01020304, 0x05060708]);
        const arr = wordArrayToUint8Array(wordArr);
        expect(arr).toEqual(new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]));
    });
});

describe('concatWordArrays', () => {
    it('Should return the concatenated WordArray', () => {
        const wordArray1 = lib.WordArray.create([0x00010203, 0x04050607]);
        const wordArray2 = lib.WordArray.create([0x08090a0b, 0x0c0d0e0f]);
        const wordArray3 = lib.WordArray.create([0x10111213, 0x14151617]);
        const result = concatWordArrays(wordArray1, wordArray2, wordArray3);
        expect(result.toString()).toEqual(wordArray1.concat(wordArray2).concat(wordArray3).toString());
    });
});

describe('normalizeArr', () => {
    it('Should return the same array if the type is Uint8Array', () => {
        const arr = new Uint8Array([1, 2, 3]);
        expect(normalizeArr(arr, 'Uint8Array')).toBe(arr);
    });

    it('Should convert the array to a Uint8Array if the type is WordArray', () => {
        const byteArr = new Uint8Array([1, 2, 3]);
        const wordArr = lib.WordArray.create(byteArr);
        const arr = normalizeArr(wordArr, 'WordArray');
        expect(arr).toBeInstanceOf(Uint8Array);
        expect(arr).toEqual(byteArr);
    });

    it('Should throw an error if the type is unknown', () => {
        const arr = new Uint8Array([1, 2, 3]);
        expect(() => normalizeArr(arr, 'Uint16Array' as ArrType)).toThrow();
    });

    it('Should throw an error if the type is wrong', () => {
        const arr = new Uint8Array([1, 2, 3]);
        expect(() => normalizeArr(arr, 'WordArray')).toThrow();
        expect(() => normalizeArr(lib.WordArray.create(arr), 'Uint8Array')).toThrow();
    });
});

describe('assemble', () => {
    it('Should return the concatenated Uint8Array with calculated sizes', () => {
        const arr1 = new Uint8Array([1, 2, 3]);
        const arr2 = new Uint8Array([4, 5, 6, 7, 8]);
        const arr3 = new Uint8Array([9, 10]);
        const arr4 = new Uint8Array([11, 12, 13, 14]);
        const format: FileFormat = [
            { size: 3, type: 'Uint8Array' },
            { calcSize: 4, type: 'WordArray' },
            { size: 2, type: 'WordArray' },
            { calcSize: 2, type: 'Uint8Array' }
        ];
        const result = assemble(format, arr1, lib.WordArray.create(arr2), lib.WordArray.create(arr3), arr4);
        expect(result).toEqual(new Uint8Array([
            4, 5, 6, 7, 8,
            11, 12, 13, 14,
            1, 2, 3,
            0, 0, 0, 5,
            9, 10,
            0, 4,
        ]));
    });

    it('Should throw an error for invalid data size or format', () => {
        const arr1 = new Uint8Array([1, 2]);
        const arr2 = new Uint8Array([4, 5, 6, 7, 8]);
        const arr3 = new Uint8Array([9, 10]);
        const arr4 = new Uint8Array([11, 12, 13, 14]);
        const format: FileFormat = [
            { size: 3, type: 'Uint8Array' },
            { calcSize: 4, type: 'WordArray' },
            { size: 2, type: 'WordArray' },
            { calcSize: 2, type: 'Uint8Array' }
        ];
        expect(() => assemble(format, arr1, lib.WordArray.create(arr2), lib.WordArray.create(arr3), arr4)).toThrow('Invalid data size or format');
    });
});

describe('customizeArr', () => {
    it('Should return the same array if the type is the same', () => {
        const arr = new Uint8Array([1, 2, 3]);
        expect(customizeArr(arr, 'Uint8Array')).toBe(arr);
    });

    it('Should convert the array to a WordArray if the type is WordArray', () => {
        const arr = new Uint8Array([1, 2, 3]);
        const wordArr = customizeArr(arr, 'WordArray');
        expect(wordArr).toHaveProperty('words');
        expect(wordArr.toString()).toEqual(lib.WordArray.create(arr).toString());
    });

    it('Should throw an error if the type is unknown', () => {
        const arr = new Uint8Array([1, 2, 3]);
        expect(() => customizeArr(arr, 'Uint16Array' as ArrType)).toThrow();
    });
});

describe('disassemble', () => {
    it('Should return the disassembled parts of the Uint8Array', () => {
        const format: FileFormat = [
            { size: 3, type: 'Uint8Array' },
            { calcSize: 4, type: 'WordArray' },
            { size: 2, type: 'WordArray' },
            { calcSize: 2, type: 'Uint8Array' }
        ];
        const arr1 = new Uint8Array([1, 2, 3]);
        const arr2 = new Uint8Array([4, 5, 6, 7, 8]);
        const arr3 = new Uint8Array([9, 10]);
        const arr4 = new Uint8Array([11, 12, 13, 14]);
        const assembled = assemble(format, arr1, lib.WordArray.create(arr2), lib.WordArray.create(arr3), arr4);
        const result = disassemble(format, assembled);
        expect(result[0]).toEqual(arr1);
        expect(result[1].toString()).toEqual(lib.WordArray.create(arr2).toString());
        expect(result[2].toString()).toEqual(lib.WordArray.create(arr3).toString());
        expect(result[3]).toEqual(arr4);
    });

    it('Should throw an error for invalid data size or format', () => {
        const format: FileFormat = [
            { size: 3, type: 'Uint8Array' },
            { calcSize: 4, type: 'WordArray' }
        ];
        const invalidData = new Uint8Array([1, 2, 3]);
        expect(() => disassemble(format, invalidData)).toThrow('Invalid data size or format');
    });
});
