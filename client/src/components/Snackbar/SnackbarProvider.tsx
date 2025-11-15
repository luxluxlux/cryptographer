import { memo } from 'react';
import { SnackbarProvider as NotistackProvider } from 'notistack';
import { isMobile } from 'utils/device';
import { getComponentWithVariant } from './utils';
import { ISnackbarProviderProps } from './interfaces';

const COMPONENTS = {
    default: getComponentWithVariant('info'),
    error: getComponentWithVariant('error'),
    success: getComponentWithVariant('success'),
    warning: getComponentWithVariant('warning'),
    info: getComponentWithVariant('info'),
};

// FIXME: It adds goober css-in-js inline styles, get rid of it
/**
 * A Notistack provider wrapper.
 * @param props The properties for the Notistack provider.
 * @returns Provider for calling custom pop-up windows.
 */
export const SnackbarProvider = (props: ISnackbarProviderProps) => (
    <NotistackProvider
        maxSnack={isMobile() ? 1 : 2}
        autoHideDuration={5000}
        disableWindowBlurListener
        preventDuplicate
        Components={COMPONENTS}
    >
        {props.children}
    </NotistackProvider>
);

SnackbarProvider.displayName = 'SnackbarProvider';

export default memo(SnackbarProvider);
