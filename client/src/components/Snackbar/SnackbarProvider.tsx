import { memo, ReactNode } from 'react';
import { SnackbarProvider as NotistackProvider } from 'notistack';
import { BREAKPOINT, useBreakpoint } from 'utils/breakpoints';
import { getComponentWithVariant } from './utils';

interface IProps {
    children: ReactNode;
}

const COMPONENTS = {
    default: getComponentWithVariant('info'),
    error: getComponentWithVariant('error'),
    success: getComponentWithVariant('success'),
    warning: getComponentWithVariant('warning'),
    info: getComponentWithVariant('info'),
};

const SnackbarProvider = (props: IProps) => {
    const isDesktop = useBreakpoint(BREAKPOINT.S);
    return (
        <NotistackProvider
            maxSnack={isDesktop ? 2 : 1}
            autoHideDuration={5000}
            disableWindowBlurListener
            preventDuplicate
            Components={COMPONENTS}
        >
            {props.children}
        </NotistackProvider>
    );
};

SnackbarProvider.displayName = 'SnackbarProvider';

export default memo(SnackbarProvider);
