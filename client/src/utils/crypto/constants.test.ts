import { AES, lib } from 'crypto-js';
import { DEFAULT_CIPHER_PARAMS } from './constants';

describe('DEFAULT_CIPHER_PARAMS', () => {
    it('Should have correct properties', () => {
        const defult = lib.CipherParams.create({
            ...DEFAULT_CIPHER_PARAMS
        })
        const crypted = AES.encrypt('Hello World', 'testPassword');
        for (const key in DEFAULT_CIPHER_PARAMS) {
            expect(defult[key as keyof lib.CipherParams]).toEqual(crypted[key as keyof lib.CipherParams]);
        }
    });
});
