import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { upload } from 'utils/common';
import Button from 'components/Button';

const Lobby = memo(() => {
    const navigate = useNavigate();

    const handleClick = useCallback(async () => {
        try {
            const file = await upload();
            navigate('/password', { state: { file } });
        } catch (error) {
            console.error(error);
            // TODO Show a messagebox (maybe create an error logger)
        }
    }, [navigate]);

    return (
        <div className="lobby">
            <div className="lobby__description">
                <p>The easiest way to protect your files with the password.</p>
                <p>Choose a file on your computer to encrypt.</p>
            </div>
            <Button onClick={handleClick}>Select file</Button>
        </div>
    );
});

Lobby.displayName = 'Lobby';

export default memo(Lobby);
