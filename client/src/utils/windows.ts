import { createContext } from 'react';
import { IWindowManagerContext } from './interfaces';

export const WindowManagerContext = createContext<IWindowManagerContext>({} as IWindowManagerContext);
