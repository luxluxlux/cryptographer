import { AES, lib } from 'crypto-js';
import { PARSED_VERSION } from 'utils/constants';
import { FILE_FORMAT, IV_SIZE, KEY_SIZE, SALT_SIZE } from './constants';
import { disassemble, readAsArrayBuffer } from './utils';
import {
    buildFile,
    calcHMAC,
    checkBack,
    cryptFile,
    decryptBuffer,
    decryptFile,
    encryptBuffer,
    encryptFile,
    generateIV,
    generateSalt,
    getKey,
    parse
} from './core';

describe('generateSalt', () => {
    it('Should generate a salt with a length of SALT_SIZE', () => {
        const salt = generateSalt();
        expect(salt.words.length).toEqual(SALT_SIZE / 4);
    });

    it('Should generate different salts on each call', () => {
        const salt1 = generateSalt();
        const salt2 = generateSalt();
        expect(salt1.toString()).not.toEqual(salt2.toString());
    });
});

describe('generateIV', () => {
    it('Should generate an IV with a length of IV_SIZE', () => {
        const iv = generateIV();
        expect(iv.words.length).toEqual(IV_SIZE / 4);
    });

    it('Should generate different IVs on each call', () => {
        const iv1 = generateIV();
        const iv2 = generateIV();
        expect(iv1.toString()).not.toEqual(iv2.toString());
    });
});

describe('getKey', () => {
    it('Should return a key with with a length of KEY_SIZE', () => {
        const key = getKey('test', generateSalt());
        expect(key.words.length).toEqual(KEY_SIZE);
    });

    it('Should return different keys for different passwords', () => {
        const key1 = getKey('test1', generateSalt());
        const key2 = getKey('test2', generateSalt());
        expect(key1.toString()).not.toEqual(key2.toString());
    });
});

describe('calcHMAC', () => {
    it('Should return the same HMAC for the same data, iv, key and salt', () => {
        const data = lib.CipherParams.create({
            ciphertext: lib.WordArray.random(16)
        });
        const key = getKey('test', generateSalt());
        const iv = generateIV();
        const hmac1 = calcHMAC(data, iv, key);
        const hmac2 = calcHMAC(data, iv, key);
        expect(hmac1.toString()).toEqual(hmac2.toString());
    });
});

describe('buildFile', () => {
    it('Should return a Uint8Array with the correct format', () => {
        const salt = generateSalt();
        const iv = generateIV();
        const key = getKey('test', salt);
        const data = lib.WordArray.random(16);
        const cipher = AES.encrypt(data, key, { iv });
        const hmac = calcHMAC(cipher, iv, key);

        const result = buildFile({
            salt,
            hmac,
            iv,
            cipher,
        });

        const [ciphertext, ivResult, hmacResult, saltResult, version] = disassemble(FILE_FORMAT, result);

        expect(ciphertext.toString()).toEqual(cipher.ciphertext.toString());
        expect(ivResult.toString()).toEqual(iv.toString());
        expect(hmacResult.toString()).toEqual(hmac.toString());
        expect(saltResult.toString()).toEqual(salt.toString());
        expect(version).toEqual(new Uint8Array(PARSED_VERSION));
    });

    it('Should throw an error if the file cannot be built correctly', () => {
        const salt = generateSalt();
        const iv = generateIV();
        const key = getKey('test', salt);
        const data = lib.WordArray.random(16);
        const cipher = AES.encrypt(data, key, { iv });
        const hmac = calcHMAC(cipher, iv, key);
        expect(() => buildFile({
            // Passing null to trigger an error
            salt: null as unknown as lib.WordArray,
            hmac,
            iv,
            cipher,
        })).toThrow();
    });
});

describe('checkBack', () => {
    it('Should return true if the decrypted buffer matches the original buffer', async () => {
        const buffer = Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]).buffer;
        const password = 'testPassword';

        const encrypted = await encryptBuffer(buffer, password);
        const result = await checkBack(buffer, encrypted.buffer, password);

        expect(result).toBe(true);
    });

    it('Should return false if the decrypted buffer does not match the original buffer', async () => {
        const buffer = Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]).buffer;
        const differentBuffer = Uint8Array.from([68, 105, 102, 102, 101, 114, 101, 110, 116, 32, 67, 111, 110, 116, 101, 110, 116]).buffer;
        const password = 'testPassword';

        const encrypted = await encryptBuffer(differentBuffer, password);
        const result = await checkBack(buffer, encrypted.buffer, password);

        expect(result).toBe(false);
    });
});


describe('encryptBuffer', () => {
    it('Should return an encrypted Uint8Array with the correct format', async () => {
        const buffer = Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]).buffer;
        const password = 'testPassword';

        const encrypted = await encryptBuffer(buffer, password);

        const [ciphertext, iv, hmac, salt, version] = disassemble(FILE_FORMAT, encrypted);
        const key = getKey(password, salt);
        const data = lib.WordArray.create(buffer);
        const cipher = AES.encrypt(data, key, { iv });
        const expectedHmac = calcHMAC(cipher, iv, key);

        expect(ciphertext.toString()).toEqual(cipher.ciphertext.toString());
        expect(expectedHmac.toString()).toEqual(hmac.toString());
        expect(version).toEqual(new Uint8Array(PARSED_VERSION));
    });

    it('Should throw an error if the buffer is empty', async () => {
        const buffer = new ArrayBuffer(0);
        const password = 'testPassword';
        await expect(encryptBuffer(buffer, password)).rejects.toThrow();
    });
});

describe('encryptFile', () => {
    it('Should return an encrypted Uint8Array with the correct format', async () => {
        const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
        const password = 'testPassword';

        const encrypted = await encryptFile(file, password);

        const [ciphertext, iv, hmac, salt, version] = disassemble(FILE_FORMAT, encrypted);
        const key = getKey(password, salt);
        const data = lib.WordArray.create(await readAsArrayBuffer(file));
        const cipher = AES.encrypt(data, key, { iv });
        const expectedHmac = calcHMAC(cipher, iv, key);

        expect(ciphertext.toString()).toEqual(cipher.ciphertext.toString());
        expect(expectedHmac.toString()).toEqual(hmac.toString());
        expect(version).toEqual(new Uint8Array(PARSED_VERSION));
    });

    it('Should throw an error if the file is empty', async () => {
        const file = new File([], 'test.txt', { type: 'text/plain' });
        const password = 'testPassword';
        await expect(encryptFile(file, password)).rejects.toThrow();
    });
});

describe('decryptBuffer', () => {
    it('Should return the decrypted Uint8Array', async () => {
        const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
        const password = 'testPassword';

        const encryptedFile = await encryptFile(file, password);
        const encrypted = encryptedFile.buffer;
        const decrypted = await decryptBuffer(encrypted, password);

        const buffer = await readAsArrayBuffer(file);
        const arr = new Uint8Array(buffer);
        expect(decrypted).toEqual(arr);
    });

    it('Should throw an error if the buffer is empty', async () => {
        const buffer = new ArrayBuffer(0);
        const password = 'testPassword';
        await expect(decryptBuffer(buffer, password)).rejects.toThrow();
    });
});

describe('decryptFile', () => {
    it('Should return the decrypted Uint8Array', async () => {
        const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
        const password = 'testPassword';

        const encrypted = new File([await encryptFile(file, password)], 'test.txt', { type: 'text/plain' });
        const decrypted = await decryptFile(encrypted, password);

        const buffer = await readAsArrayBuffer(file);
        const arr = new Uint8Array(buffer);
        expect(decrypted).toEqual(arr);
    });

    it('Should throw an error if the file is empty', async () => {
        const file = new File([], 'test.txt', { type: 'text/plain' });
        const password = 'testPassword';
        await expect(decryptFile(file, password)).rejects.toThrow();
    });
});

describe('parse', () => {
    it('Should return a promise that resolves to an object containing the key, hmac, iv and cipher', async () => {
        const buffer = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]).buffer;
        const password = 'testPassword';

        const encrypted = await encryptBuffer(buffer, password);
        const { key, hmac, iv, cipher } = await parse(encrypted.buffer, password);

        expect(key).toHaveProperty('words');
        expect(hmac).toHaveProperty('words');
        expect(iv).toHaveProperty('words');
        expect(cipher).toHaveProperty('ciphertext');
    });

    it('Should throw an error if the buffer is empty', async () => {
        const buffer = new ArrayBuffer(0);
        const password = 'testPassword';
        await expect(parse(buffer, password)).rejects.toThrow();
    });
});

describe('decrypt', () => {
    it('Should return the decrypted Uint8Array', async () => {
        const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
        const password = 'testPassword';

        const encrypted = new File([await encryptFile(file, password)], 'test.txt', { type: 'text/plain' });
        const decrypted = await decryptFile(encrypted, password);

        const buffer = await readAsArrayBuffer(file);
        const arr = new Uint8Array(buffer);
        expect(decrypted).toEqual(arr);
    });

    it('Should throw an error if the file is empty', async () => {
        const file = new File([], 'test.txt', { type: 'text/plain' });
        const password = 'testPassword';
        await expect(decryptFile(file, password)).rejects.toThrow();
    });
});

describe('crypt', () => {
    it('Should return the decrypted Uint8Array', async () => {
        const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
        const password = 'testPassword';

        const encrypted = new File([await encryptFile(file, password)], 'test.txt', { type: 'text/plain' });
        const decrypted = await cryptFile('decrypt', encrypted, password);

        const buffer = await readAsArrayBuffer(file);
        const arr = new Uint8Array(buffer);
        expect(decrypted).toEqual(arr);
    });

    it('Should return the encrypted Uint8Array', async () => {
        const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
        const password = 'testPassword';

        const encrypted = await cryptFile('encrypt', file, password);
        const decrypted = await cryptFile('decrypt', new File([encrypted], 'test.txt', { type: 'text/plain' }), password);

        const buffer = await readAsArrayBuffer(file);
        const arr = new Uint8Array(buffer);
        expect(decrypted).toEqual(arr);
    });

    it('Should throw an error if the file is empty', async () => {
        const file = new File([], 'test.txt', { type: 'text/plain' });
        const password = 'testPassword';
        await expect(cryptFile('decrypt', file, password)).rejects.toThrow();
    });

    it('Should throw an error if the action is not encrypt or decrypt', async () => {
        const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
        const password = 'testPassword';
        await expect(cryptFile('test' as 'encrypt' | 'decrypt', file, password)).rejects.toThrow();
    });

    it('Should successfully encrypt and decrypt various file types', async () => {
        const fileTypes = [
            { content: 'Hello World', name: 'text.txt', type: 'text/plain' },
            { content: '<html><body>Hello World</body></html>', name: 'index.html', type: 'text/html' },
            { content: 'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=', name: 'image.png', type: 'image/png', isBase64: true },
            // TODO: Add more file types
        ];

        const password = 'testPassword';

        for (const fileType of fileTypes) {
            const fileContent = fileType.isBase64 ? Uint8Array.from(atob(fileType.content), c => c.charCodeAt(0)) : fileType.content;
            const file = new File([fileContent], fileType.name, { type: fileType.type });

            const encrypted = await cryptFile('encrypt', file, password);
            const decrypted = await cryptFile('decrypt', new File([encrypted], fileType.name, { type: fileType.type }), password);

            const expectedContent = fileType.isBase64
                ? fileContent as Uint8Array
                : new Uint8Array((fileContent as string).split('').map(char => char.charCodeAt(0)));
            expect(decrypted).toEqual(expectedContent);
        }
    });
});
