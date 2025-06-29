import { lib } from 'crypto-js';
import { ArrType, ExtractArrTypes, FileFormat, GetArrType } from './interfaces';

/**
 * Read file as ArrayBuffer
 * @param file File to read
 * @returns Promise resolving with the file content as an ArrayBuffer
 */
export async function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = (error) => reject(error);
    });
}

/**
 * Compare two ArrayBuffers
 * @param buffer1 First buffer to compare
 * @param buffer2 Second buffer to compare
 * @returns Whether the buffers are equal
 */
export function compareArrayBuffers(buffer1: ArrayBufferLike, buffer2: ArrayBufferLike): boolean {
    if (buffer1.byteLength !== buffer2.byteLength) {
        return false;
    }
    const arr1 = new Uint8Array(buffer1);
    const arr2 = new Uint8Array(buffer2);
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

/**
 * Convert number to Uint8Array (big-endian)
 * @param number Positive number to be converted
 * @param byteLength Length of the result array
 * @returns Uint8Array representation of the number
 */
export function numberToUint8Array(number: number, byteLength: number): Uint8Array {
    if (number < 0) {
        throw new Error('Number must be positive');
    }
    if (byteLength < 1) {
        throw new Error('Byte length must be greater than 0');
    }
    const result = new Uint8Array(byteLength);
    for (let i = byteLength - 1; i >= 0; i--) {
        result[i] = number & 0xff;
        number = Math.trunc(number / 256);
    }
    if (number > 0) {
        throw new Error('The result length is greater than the byte length');
    }
    return result;
}

/**
 * Convert Uint8Array to number (big-endian)
 * @param arr Uint8Array to be converted
 * @returns Number representation of the array
 */
export function uint8ArrayToNumber(arr: Uint8Array): number {
    return arr.reduce((total, byte) => (total << 8) | byte, 0);
}

/**
 * Concatenate multiple Uint8Arrays into one
 * @param arrays Uint8Arrays to be concatenated
 * @returns Concatenated Uint8Arrays
 */
export function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
    const totalLength = arrays.reduce((total, current) => total + current.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const array of arrays) {
        result.set(array, offset);
        offset += array.length;
    }
    return result;
}

/**
 * Convert WordArray to native Uint8Array
 * @param wordArray CryptoJS WordArray to convert
 * @returns A Uint8Array representation of the given WordArray
 */
export function wordArrayToUint8Array(wordArray: lib.WordArray): Uint8Array {
    const length = wordArray.sigBytes;
    const arr = new Uint8Array(length);
    for (let i = 0, j = 0; i < length; i++) {
        const word = wordArray.words[i];
        arr[j++] = word >> 24;
        arr[j++] = (word >> 16) & 0xff;
        arr[j++] = (word >> 8) & 0xff;
        arr[j++] = word & 0xff;
    }
    return arr;
}

/**
 * Concatenate multiple WordArrays into one
 * @param wordArrays WordArrays to be concatenated
 * @returns Concatenated WordArray
 */
export function concatWordArrays(...wordArrays: lib.WordArray[]): lib.WordArray {
    return wordArrays.reduce((total, current) => total.concat(current), lib.WordArray.create([]));
}

/**
 * Convert an array to a Uint8Array based on the provided format
 * @param arr Array to be converted
 * @param type Format of the array
 * @return Converted array
 */
export function normalizeArr(arr: Uint8Array | lib.WordArray, type: ArrType): Uint8Array {
    const error = new Error('Invalid array format');
    if ('words' in arr) {
        if (type !== 'WordArray') {
            throw error;
        }
        return wordArrayToUint8Array(arr);
    }
    if (type !== 'Uint8Array') {
        throw error;
    }
    return arr;
}

/**
 * Combine multiple data arrays into one
 * If the size is specified, it will be compared, if not, it will be calculated and converted into
 * Uint8Array of sizeSize length. All calculated sizes of data arrays will be located between data with
 * fixed and variable size.
 * Warning! The function assumes that the data is ordered from the end for the polyglot file structure.
 * 
 * @example
 * Bytes | Description 
 * ------+-------------------------------
 *     m | Data 4
 *     n | Data 3
 *     4 | Size of data 4 (m)
 *    16 | Data 2
 *     4 | Size of data 3 (n)
 *     8 | Data 1
 *
 * @param format File format to use for assembly
 * @param arrs Array of data arrays
 * @return Concatenated Uint8Array
 */
export function assemble<T extends FileFormat>(format: T, ...arrs: ExtractArrTypes<T>): Uint8Array {
    const result: Uint8Array[] = [];
    // i - format cursor
    // j - data cursor
    for (let i = 0, j = 0; i < format.length; i++) {
        const { size, calcSize, type } = format[i];
        const arr = arrs[i];
        const buffer = normalizeArr(arr, type);
        if (size) {
            if (buffer.length !== size) {
                throw new Error('Invalid data size or format');
            }
            result.push(buffer);
        } else {
            result.push(numberToUint8Array(buffer.length, calcSize!));
            result.splice(j, 0, buffer);
            j++;
        }
    }
    return concatUint8Arrays(...result);
}

/**
 * Convert bytes array to the specified type
 * @param bytes Array to be converted
 * @param type Type to which the array should be converted
 * @return The converted array
 */
export function customizeArr<T extends ArrType>(bytes: Uint8Array, type: T): GetArrType<T> {
    if (!['Uint8Array', 'WordArray'].includes(type)) {
        throw new Error('Invalid type');
    }
    return (type === 'WordArray' ? lib.WordArray.create(bytes) : bytes) as GetArrType<T>;
}

/**
 * Split the data array into its component parts based on the provided file format
 * Warning! The function assumes that the data is ordered from the end for the polyglot file structure
 * @param format The file format to use for disassembly
 * @param bytes Data array to disassemble
 * @return The disassembled parts of the Uint8Array
 */
export function disassemble<T extends FileFormat>(
    format: T,
    bytes: Uint8Array,
): ExtractArrTypes<T> {
    const formatLength = format.reduce((total, current) => total + (current.size || current.calcSize)!, 0);
    const result = [] as ExtractArrTypes<T>;
    // i - format cursor
    // j - fixed data cursor
    // k - variable data cursor
    for (let i = format.length - 1, j = bytes.length, k = bytes.length - formatLength; i >= 0; i--) {
        const { size, calcSize, type } = format[i];
        if (j < (size || calcSize)!) {
            throw new Error('Invalid data size or format');
        }
        if (size) {
            const buffer = bytes.slice(j - size, j);
            const arr = customizeArr(buffer, type);
            result.unshift(arr);
            j -= size;
        } else {
            const length = uint8ArrayToNumber(bytes.slice(j - calcSize!, j));
            if (k < length) {
                throw new Error('Invalid data size or format');
            }
            const buffer = bytes.slice(k - length, k);
            const arr = customizeArr(buffer, type);
            result.unshift(arr);
            k -= length;
            j -= calcSize!;
        }
    }
    return result;
}
