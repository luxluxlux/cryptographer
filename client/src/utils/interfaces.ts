import { ReactNode } from 'react';

export interface IStep {
    index?: number;
    text?: string;
    color: string;
}

export interface IWindowManagerContext {
    open: (content: ReactNode, modal?: boolean, closable?: boolean) => void;
    close: () => void;
}
