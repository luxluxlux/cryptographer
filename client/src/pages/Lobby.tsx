import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'components/Button';

const Lobby = memo(() => {
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement)?.files?.[0];
            
            if (!file) {
                alert('An error occurred while loading.');
                return;
            }

            navigate('/password', { state: { file } });
        }
        input.click();
        // TODO Clean
    }, [navigate]);

    return (
        <div className="lobby">
            <div className='lobby__description'>
                <p>The easiest way to protect your files with the password.</p>
                <p>Choose a file on your computer to encrypt.</p>
            </div>
            <Button onClick={handleClick}>Select file</Button>
        </div>
    );
});

export default Lobby;