
import { AES, PBKDF2, lib } from 'crypto-js';

async function readAsArrayBuffer(file: File) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = error => reject(error);
    });
}

async function readAsText(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
}

// TODO Try to simplify
function convertWordArrayToUint8Array(wordArray: lib.WordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes") ? wordArray.sigBytes : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length), index = 0, word, i;
    for (i = 0; i < length; i++) {
        word = arrayOfWords[i];
        uInt8Array[index++] = word >> 24;
        uInt8Array[index++] = (word >> 16) & 0xff;
        uInt8Array[index++] = (word >> 8) & 0xff;
        uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
}

function getKey(password: string) {
    // TODO Get salt from user certificate or generate it
    //  https://crypto.stackexchange.com/questions/37629/pbkdf2-without-salt-on-16-digit-password
    return PBKDF2(password, password, {
        // Get from the config
        keySize: 256 / 32,
        iterations: 1000,
    });
}

export async function encrypt(file: File, password: string) {
    const key = getKey(password);
    const arrBuffer = await readAsArrayBuffer(file);
    const wordArray = lib.WordArray.create(arrBuffer);
    return AES.encrypt(wordArray, key, {
        // TODO Get iv from user certificate or generate it
        //  https://stackoverflow.com/questions/35472396/how-does-cryptojs-get-an-iv-when-none-is-specified
        iv: key,
    }).toString();
}

export async function decrypt(file: File, password: string) {
    const key = getKey(password);
    const flieText = await readAsText(file);
    const decrypted = AES.decrypt(flieText, key, {
        // TODO Get iv from user certificate or generate it
        //  https://stackoverflow.com/questions/35472396/how-does-cryptojs-get-an-iv-when-none-is-specified
        iv: key,
    });
    return convertWordArrayToUint8Array(decrypted);
}

export async function crypt(file: File, password: string, action: 'encrypt' | 'decrypt') {
    switch (action) {
        case 'encrypt':
            return encrypt(file, password);
        case 'decrypt':
            return decrypt(file, password);
    }
}


