import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/Header';
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
    }, []);

    return (
        <div className="lobby">
            <Header>Cryptographer</Header>
            <p>Choose a file on your computer to encrypt.</p>
            <Button onClick={handleClick}>Select file</Button>
        </div>
    );
});

export default Lobby;