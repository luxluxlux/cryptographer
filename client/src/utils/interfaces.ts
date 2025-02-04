import { ReactNode } from 'react';

export interface IStep {
    index?: number;
    text?: string;
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
