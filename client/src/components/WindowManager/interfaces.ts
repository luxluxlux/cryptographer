import { ReactElement } from 'react';
import { WINDOW } from './constants';

export interface IWindowManagerOptions {
    /**
     * The window will be displayed on top of other elements
     */
    modal?: boolean;
    /**
     * The window can be closed
     */
    closable?: boolean;
    /**
     * No size limitation
     */
    fullscreen?: boolean;
}

export interface IWindowManagerContext {
    open: {
        /**
         * Open an existing window
         * @param window Window identifier
         */
        (window: WINDOW): void;
        /**
         * Open a window with custom content
         * @param content React element
         * @param options Window options
         */
        (content: ReactElement, options?: IWindowManagerOptions): void;
    }
    /**
     * Close the pop-up
     */
    close: () => void;
}

export interface IWindow {
    /**
     * URL path
     */
    path: string;
    /**
     * Component
     */
    content: ReactElement;
}