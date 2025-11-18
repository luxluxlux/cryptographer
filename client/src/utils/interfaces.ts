/**
 * Excludes all keys from T that are present in U.
 * @typeParam T The type from which to exclude keys.
 * @typeParam U The type in which keys are present.
 */
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

/**
 * Exclusive OR type.
 */
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

/**
 * Web application version ('major.minor.revision').
 */
export type Version = `${number}.${number}.${number}`;

/**
 * Parsed application version version tuple ([major, minor, revision]).
 */
export type ParsedVersion = [number, number, number];

/**
 * Action to process a file.
 */
export type Action = 'encrypt' | 'decrypt';

/**
 * Validation result.
 * @returns True on success, an error message on failure.
 */
export type ValidationResult = true | string;

/**
 * Current stage of processing.
 */
export interface IStep {
    /**
     * URL path.
     */
    path: string;
    /**
     * Accent color.
     */
    color: string;
}
