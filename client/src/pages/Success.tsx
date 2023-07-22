import { memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from 'components/Header';
import Button from 'components/Button';

const Success = memo(() => {
    const location = useLocation();

    const handleClick = useCallback(() => {
        const anchor = document.createElement('a');
        anchor.href = window.URL.createObjectURL(location.state.data);
        anchor.download = location.state.fileName;
        anchor.click();
        // TODO Clean
    }, []);

    return (
        <div className="success">
            <Header>Completed</Header>
            <p><b>{location.state.fileName}</b> is {location.state.action}ed.</p>
            <div className='password__actions'>
                <Button onClick={handleClick}>Download</Button>
                <Link to="/">
                    <Button color='secondary'>Retry</Button>
                </Link>
            </div>
        </div>
    );
});

export default Success;