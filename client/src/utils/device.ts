import { isMobile as isMobileDetect } from 'react-device-detect';

/**
 * Retrieve the user agent string from the navigator object
 * @return The user agent string, or undefined if the navigator object is not defined
 */
export function getUserAgent(): string | undefined {
    return typeof navigator !== 'undefined' ? navigator?.userAgent : undefined;
}

/**
 * Check if the current environment is mobile. Use this function instead of react-device-detect
 * constant, because it supports react-snap urls.
 * @return Returns true if the environment is mobile, false otherwise
 */
export function isMobile(): boolean {
    // For react-snap we provide special urls starting with /mobile
    if (getUserAgent() === 'ReactSnap') {
        const path = window.location.pathname;
        return path.startsWith('/mobile');
    }
    return isMobileDetect;
}
