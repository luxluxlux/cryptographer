import { createContext } from 'react';
import { IWindowManagerContext } from './interfaces';

// TODO: Create special hooks for contexts
/**
 * Window manager context.
 */
export const WindowManagerContext = createContext<IWindowManagerContext>({} as IWindowManagerContext);