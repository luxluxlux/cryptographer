import { isMobile as isMobileDetect } from 'react-device-detect';

/**
 * Retrieves the user agent string from the navigator object.
 * @returns The user agent string, or undefined if the navigator object is not defined.
 */
export function getUserAgent(): string | undefined {
    return typeof navigator !== 'undefined' ? navigator?.userAgent : undefined;
}

/**
 * Checks if the current environment is mobile.
 * @remarks Use this function instead of react-device-detect constant, because it supports
 * react-snap urls.
 * @returns True if the environment is mobile, false otherwise.
 */
export function isMobile(): boolean {
    // For react-snap we provide special urls starting with /mobile
    if (getUserAgent() === 'ReactSnap') {
        const path = window.location.pathname;
        return path.startsWith('/mobile');
    }
    return isMobileDetect;
}
