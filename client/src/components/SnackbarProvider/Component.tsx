import { forwardRef, memo, useCallback } from 'react';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { closeSnackbar, CustomContentProps } from 'notistack';

interface IProps extends CustomContentProps {
    variant: 'error' | 'success' | 'warning' | 'info';
}

const Component = forwardRef<HTMLDivElement, IProps>((props, ref) => {
    const handleClose = useCallback(() => closeSnackbar(props.id), [props.id]);

    return (
        <Alert
            className="snackback-component"
            ref={ref}
            variant="outlined"
            severity={props.variant}
            action={
                <IconButton size="small" title="Close" onClick={handleClose}>
                    <CloseIcon fontSize="small" color={props.variant} />
                </IconButton>
            }
        >
            {props.message}
        </Alert>
    );
});

Component.displayName = 'Component';

export default memo(Component);
