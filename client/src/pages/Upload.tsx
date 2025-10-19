import { memo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useSnackbar } from 'components/Snackbar';
import { APPLICATION_NAME, MAX_ALERT_FILENAME_LENGTH, STAGE, STAGE_DATA } from 'utils/constants';
import { ellipse, upload, validateFile } from 'utils/common';
import { isMobile } from 'utils/device';
import { WindowManagerContext, WINDOW } from 'components/WindowManager';

const Upload = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const windowContext = useContext(WindowManagerContext);

    const handleAboutClick = useCallback(() => {
        windowContext.open(WINDOW.HOW_IT_WORKS);
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
            navigate(STAGE_DATA[STAGE.SECURE].path, { state: { file } });
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
        <div className="upload">
            <p className="upload__description">
                Welcome to the <strong>{APPLICATION_NAME}</strong>! The easiest way to protect your
                file with a password or disguise it as another one.
            </p>
            <Link className="upload__about" component="button" onClick={handleAboutClick}>
                How does it work?
            </Link>
            <div className="upload__actions">
                <Button variant="contained" onClick={handleFileClick}>
                    Select file
                </Button>
                {!isMobile() && <div className="upload__actions-hint">or drop it here</div>}
            </div>
        </div>
    );
};

Upload.displayName = 'Upload';

export default memo(Upload);
