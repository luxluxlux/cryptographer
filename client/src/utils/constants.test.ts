import { PARSED_VERSION, VERSION, VERSION_SIZE } from './constants';
import { parseVersion } from './common';

describe('VERSION', () => {
    it('Version should be a valid version string', () => {
        expect(() => parseVersion(VERSION, VERSION_SIZE)).not.toThrow();
    });

    it('Version should be the same as in package.json', async () => {
        const versionInPackage = (await import('../../package.json')).version;
        expect(versionInPackage).toEqual(VERSION);
    });
});

describe('PARSED_VERSION', () => {
    it('PARSED_VERSION should be a tuple of numbers', () => {
        const parsedVersion = parseVersion(VERSION, VERSION_SIZE);
        expect(parsedVersion).toEqual(PARSED_VERSION);
    });

    it('The length of the version tuple should be equal to VERSION_SIZE', () => {
        expect(PARSED_VERSION.length).toEqual(VERSION_SIZE);
    });
});

