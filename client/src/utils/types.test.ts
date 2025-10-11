import { isEnumValue } from './types';

describe('isEnumValue', () => {
    it('Should return true for an enum value', () => {
        enum ENUM {
            FIRST = 'first',
            SECOND = 'second',
        }
        expect(isEnumValue(ENUM, 'first')).toEqual(true);
    });

    it('Should return false for a non-enum value', () => {
        enum ENUM {
            FIRST = 'first',
            SECOND = 'second',
        }
        expect(isEnumValue(ENUM, 'third')).toEqual(false);
    });
});
