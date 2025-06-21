import { ReactNode } from 'react';

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export type Version = `${number}.${number}.${number}`;
export type ParsedVersion = [number, number, number];

export type Action = 'encrypt' | 'decrypt';
export type ValidationResult = true | string | ReactNode;

export interface IStep {
    path: string;
    color: string;
}

export interface IWindowManagerOptions {
    modal?: boolean;
    closable?: boolean;
    fullscreen?: boolean;
}

export interface IWindowManagerContext {
    open: (content: ReactNode, options?: IWindowManagerOptions) => void;
    close: () => void;
}
