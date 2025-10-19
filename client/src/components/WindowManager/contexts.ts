import { createContext } from 'react';
import { IWindowManagerContext } from './interfaces';

// TODO: Create special hooks for contexts
export const WindowManagerContext = createContext<IWindowManagerContext>({} as IWindowManagerContext);