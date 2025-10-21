import { forwardRef, memo, useCallback } from 'react';
import clsx from 'clsx';
import { closeSnackbar, CustomContentProps } from 'notistack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { isMobile } from 'utils/device';

interface IProps extends CustomContentProps {
    title?: string;
    variant: 'error' | 'success' | 'warning' | 'info';
}

const Component = forwardRef<HTMLDivElement, IProps>((props, ref) => {
    const handleClose = useCallback(() => closeSnackbar(props.id), [props.id]);

    return (
        <Alert
            className={clsx('snackback-component', isMobile() && 'snackback-component_mobile')}
            ref={ref}
            variant="outlined"
            severity={props.variant}
            action={
                <IconButton
                    size="small"
                    title="Close"
                    aria-label="Close alert"
                    onClick={handleClose}
                >
                    <CloseIcon fontSize="small" color={props.variant} />
                </IconButton>
            }
            style={props.style}
        >
            {props.title && <AlertTitle>{props.title}</AlertTitle>}
            {props.message}
        </Alert>
    );
});

Component.displayName = 'Component';

export default memo(Component);
