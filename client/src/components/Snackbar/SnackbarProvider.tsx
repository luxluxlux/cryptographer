import { memo, ReactNode } from 'react';
import { SnackbarProvider as NotistackProvider } from 'notistack';
import { isMobile } from 'utils/device';
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

// FIXME: It adds goober css-in-js inline styles. Get rid of it.
const SnackbarProvider = (props: IProps) => (
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
