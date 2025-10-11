export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type Version = `${number}.${number}.${number}`;
export type ParsedVersion = [number, number, number];

export type Action = 'encrypt' | 'decrypt';
export type ValidationResult = true | string;

export interface IStep {
    /**
     * URL path
     */
    path: string;
    /**
     * Accent color
     */
    color: string;
}
