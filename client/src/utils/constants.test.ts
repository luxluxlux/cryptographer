import { PARSED_VERSION, VERSION, VERSION_SIZE } from './constants';
import { parseVersion } from './common';

describe('VERSION', () => {
    test('Version should be a valid version string', () => {
        expect(() => parseVersion(VERSION, VERSION_SIZE)).not.toThrow();
    });

    test('Version should be the same as in package.json', async () => {
        const versionInPackage = (await import('../../package.json')).version;
        expect(versionInPackage).toEqual(VERSION);
    });
});

describe('PARSED_VERSION', () => {
    test('PARSED_VERSION should be a tuple of numbers', () => {
        const parsedVersion = parseVersion(VERSION, VERSION_SIZE);
        expect(parsedVersion).toEqual(PARSED_VERSION);
    });

    test('The length of the version tuple should be equal to VERSION_SIZE', () => {
        expect(PARSED_VERSION.length).toEqual(VERSION_SIZE);
    });
});

