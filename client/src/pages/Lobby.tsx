import { memo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useSnackbar } from 'components/Snackbar';
import { APPLICATION_NAME, MAX_ALERT_FILENAME_LENGTH } from 'utils/constants';
import { ellipse, upload, validateFile } from 'utils/common';
import { WindowManagerContext } from 'utils/contexts';
import { BREAKPOINT, useBreakpoint } from 'utils/breakpoints';
import HowItWorks from 'windows/HowItWorks';

const Lobby = memo(() => {
    const isDesktop = useBreakpoint(BREAKPOINT.S);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const windowContext = useContext(WindowManagerContext);

    const handleAboutClick = useCallback(() => {
        windowContext.open(<HowItWorks />);
    }, [windowContext.open]);

    const handleFileClick = useCallback(async () => {
        try {
            const file = await upload();
            const validation = validateFile(file);
            if (validation !== true) {
                enqueueSnackbar({
                    variant: 'warning',
                    title: 'Unable to upload file',
                    message: (
                        <>
                            <strong>{ellipse(file.name, MAX_ALERT_FILENAME_LENGTH)}</strong>{' '}
                            isn&apos;t uploaded. {validation}
                        </>
                    ),
                });
                return;
            }
            navigate('/password', { state: { file } });
        } catch (error) {
            enqueueSnackbar({
                variant: 'error',
                title: 'Failed to upload file',
                message: 'Something went wrong. Please try again.',
            });
            console.error(error);
        }
    }, [enqueueSnackbar]);

    return (
        <div className="lobby">
            <p className="lobby__description">
                Welcome to the <strong>{APPLICATION_NAME}</strong>! The easiest way to protect your
                file with a password.
            </p>
            <Link className="lobby__about" component="button" onClick={handleAboutClick}>
                How does it work?
            </Link>
            <div className="lobby__actions">
                <Button variant="contained" onClick={handleFileClick}>
                    Select file
                </Button>
                {isDesktop && <div className="lobby__actions-hint">or drop it here</div>}
            </div>
        </div>
    );
});

Lobby.displayName = 'Lobby';

export default memo(Lobby);
