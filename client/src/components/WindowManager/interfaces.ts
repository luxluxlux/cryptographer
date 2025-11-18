import { ReactElement, ReactNode } from 'react';
import { WINDOW } from './constants';

/**
 * Window manager properties
 */
export interface IWindowManagerProps {
    /**
     * The content of the component
     */
    children: ReactNode;
}

/**
 * Window manager inner state
 */
export interface IWindowManagerState {
    content: ReactElement | null;
    modal: boolean;
    fullscreen: boolean;
}

/**
 * Options for opening windows using window manager
 */
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

/**
 * Context for updating the window manager state
 */
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

/**
 * Preset window options
 */
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
