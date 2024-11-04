import { memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { download } from 'utils/common';
import Button from 'components/Button';

const Success = memo(() => {
    const location = useLocation();

    const handleClick = useCallback(() => {
        download(location.state.data, location.state.fileName);
    }, [location.state.data, location.state.fileName]);

    return (
        <div className="success">
            <p className='success__description'><b>{location.state.fileName}</b> is successfully {location.state.action}ed.</p>
            <div className='password__actions'>
                <Button onClick={handleClick}>Download</Button>
                <Link to="/">
                    <Button>Again</Button>
                </Link>
            </div>
        </div>
    );
});

export default Success;