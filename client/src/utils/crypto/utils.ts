import { lib } from 'crypto-js';
import { ArrType, ExtractArrTypes, FileFormat, GetArrType } from './interfaces';

/**
 * Read file as Uint8Array
 * @param file File to read
 * @returns Promise resolving with the file content as a Uint8Array
 */
export async function readAsUint8Array(file: File): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
        reader.onerror = (error) => reject(error);
    });
}

/**
 * Compare two Uint8Arrays
 * @param arr1 First array to compare
 * @param arr2 Second array to compare
 * @returns Whether the arrays are equal
 */
export function compareUint8Arrays(arr1: Uint8Array, arr2: Uint8Array): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

/**
 * Compare two WordArrays
 * @param arr1 First array to compare
 * @param arr2 Second array to compare
 * @returns Whether the arrays are equal
 */
export function compareWordArrays(arr1: lib.WordArray, arr2: lib.WordArray): boolean {
    if (arr1.sigBytes !== arr2.sigBytes) {
        return false;
    }
    for (let i = 0; i < arr1.words.length; i++) {
        if (arr1.words[i] ^ arr2.words[i]) {
            return false;
        }
    }
    return true;
}

/**
 * Convert UTF-8 string to Uint8Array
 * @param str String to be converted
 * @return The converted Uint8Array
 */
export function stringToUint8Array(str: string): Uint8Array {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

/**
 * Convert Uint8Array to UTF-8 string
 * @param arr Uint8Array to be converted
 * @return The converted string
 */
export function uint8ArrayToString(arr: Uint8Array): string {
    const decoder = new TextDecoder();
    return decoder.decode(arr);
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
 * TODO: Try to get rid of the additionalData parameter
 * 
 * @example Straight traversal
 * Bytes | Description 
 * ------+-------------------------------
 *     8 | Data 1
 *     4 | Size of data 2 (n)
 *    16 | Data 3
 *     4 | Size of data 4 (m)
 *     n | Data 2
 *     m | Data 4
 *     . | Unformatted data
 * 
 * @example Reverse traversal
 * Bytes | Description 
 * ------+-------------------------------
 *     . | Unformatted data
 *     m | Data 4
 *     n | Data 2
 *     4 | Size of data 4 (m)
 *    16 | Data 3
 *     4 | Size of data 2 (n)
 *     8 | Data 1
 *
 * @param format File format to use for assembly
 * @param formattedData Array of data arrays according to format
 * @param additionalData Unformatted data
 * @param reverse Reverse assembling direction, e.g., for polyglot files https://en.wikipedia.org/wiki/Polyglot_(computing)
 * @return Concatenated Uint8Array
 */
export function assemble<T extends FileFormat>(
    format: T,
    formattedData: ExtractArrTypes<T>,
    additionalData?: Uint8Array,
    reverse: boolean = false
): Uint8Array {
    const result: Uint8Array[] = [];
    for (let i = 0; i < format.length; i++) {
        const formatIndex = reverse ? format.length - 1 - i : i;
        const { size, calcSize, type } = format[formatIndex];
        const arr = formattedData[formatIndex];
        const buffer = normalizeArr(arr, type);
        const dataIndex = reverse ? result.length - i : i;
        if (size) {
            if (buffer.length !== size) {
                throw new Error('Invalid data size or format');
            }
            result.splice(dataIndex, 0, buffer);
        } else {
            result.splice(dataIndex, 0, numberToUint8Array(buffer.length, calcSize!));
            result[reverse ? 'unshift' : 'push'](buffer);
        }
    }
    if (additionalData) {
        result[reverse ? 'unshift' : 'push'](additionalData);
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
 * @param format The file format to use for disassembly
 * @param bytes Data array to disassemble
 * @param reverse Reverse assembling direction, e.g., for polyglot files https://en.wikipedia.org/wiki/Polyglot_(computing)
 * @return The disassembled formatted and additional data
 */
export function disassemble<T extends FileFormat>(
    format: T,
    bytes: Uint8Array,
    reverse: boolean = false
): {
    formattedData: ExtractArrTypes<T>,
    additionalData?: Uint8Array
} {
    const formatLength = format.reduce((total, current) => total + (current.size || current.calcSize)!, 0);
    const formattedData = [] as ExtractArrTypes<T>;
    // i - format cursor
    // j - fixed data cursor
    // k - variable data cursor
    let k = formatLength;
    for (let i = 0, j = 0; i < format.length; i++) {
        const formatIndex = reverse ? format.length - 1 - i : i;
        const { size, calcSize, type } = format[formatIndex];
        if (j > formatLength - (size || calcSize)!) {
            throw new Error('Invalid data size or format');
        }
        const fixedDataIndex = reverse ? bytes.length - j : j;
        if (size) {
            const buffer = bytes.slice(
                fixedDataIndex - (reverse ? size : 0),
                fixedDataIndex + (reverse ? 0 : size)
            );
            const arr = customizeArr(buffer, type);
            formattedData[reverse ? 'unshift' : 'push'](arr);
            j += size;
        } else {
            const length = uint8ArrayToNumber(
                bytes.slice(
                    fixedDataIndex - (reverse ? calcSize! : 0),
                    fixedDataIndex + (reverse ? 0 : calcSize!)
                )
            );
            if (k > bytes.length - length) {
                throw new Error('Invalid data size or format');
            }
            const variableDataIndex = reverse ? bytes.length - k : k;
            const buffer = bytes.slice(
                variableDataIndex - (reverse ? length : 0),
                variableDataIndex + (reverse ? 0 : length)
            );
            const arr = customizeArr(buffer, type);
            formattedData[reverse ? 'unshift' : 'push'](arr);
            k += length;
            j += calcSize!;
        }
    }
    const additionalData = k < bytes.length
        ? (reverse ? bytes.slice(0, bytes.length - k) : bytes.slice(k))
        : undefined;
    return {
        formattedData,
        additionalData
    };
}
