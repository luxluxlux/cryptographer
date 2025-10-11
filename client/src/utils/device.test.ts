import { getUserAgent, isMobile } from './device';

describe('getUserAgent', () => {
    it('Should return the user agent string from the navigator object', () => {
        const userAgent =
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36';
        Object.defineProperty(window.navigator, 'userAgent', {
            get: () => userAgent,
        });

        expect(getUserAgent()).toEqual(userAgent);
    });

    it('Should return undefined if the navigator object is not defined', () => {
        const originalNavigator = window.navigator;
        Object.defineProperty(window, 'navigator', {
            value: undefined,
            writable: true,
        });

        expect(getUserAgent()).toBeUndefined();

        window.navigator = originalNavigator;
    });
});

// We don't test cases except for react-snap, since react-device-detect gets isMobile value during
// environment initialization
describe('isMobile', () => {
    it('Should return true for a react-snap url starting with /mobile', () => {
        const originalNavigator = window.navigator;
        Object.defineProperty(window, 'navigator', {
            value: {
                get userAgent() {
                    return 'ReactSnap';
                },
            },
        });

        const originalLocation = window.location;
        Object.defineProperty(window, 'location', {
            value: {
                pathname: '/mobile',
            },
        });

        expect(isMobile()).toEqual(true);

        window.navigator = originalNavigator;
        Object.defineProperty(window, 'location', {
            value: originalLocation,
            writable: true,
        });
    });
});
