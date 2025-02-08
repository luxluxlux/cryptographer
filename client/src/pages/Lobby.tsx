import { memo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { upload, validateFile } from 'utils/common';
import { WindowManagerContext } from 'utils/windows';
import HowItWorks from 'windows/HowItWorks';

const Lobby = memo(() => {
    const navigate = useNavigate();
    const windowContext = useContext(WindowManagerContext);

    const handleAboutClick = useCallback(() => {
        windowContext.open(<HowItWorks />);
    }, [windowContext.open]);

    const handleFileClick = useCallback(async () => {
        try {
            const file = await upload();
            const validation = validateFile(file);
            if (validation !== true) {
                alert(validation);
                return;
            }
            navigate('/password', { state: { file } });
        } catch (error) {
            console.error(error);
            // TODO Show a messagebox (maybe create an error logger)
        }
    }, [navigate]);

    return (
        <div className="lobby">
            <p className="lobby__description">
                Welcome to the <b>Cryptographer</b>! The easiest way to protect your file with a
                password or key.
            </p>
            <Button onClick={handleAboutClick}>How does it work?</Button>
            <div className="lobby__actions">
                <Button variant="contained" onClick={handleFileClick}>
                    Select file
                </Button>
                <div className="lobby__actions-hint">or drop it here</div>
            </div>
        </div>
    );
});

Lobby.displayName = 'Lobby';

export default memo(Lobby);
