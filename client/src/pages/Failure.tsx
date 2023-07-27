import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from 'components/Button';

// TODO Rename to "Fail"
const Failure = memo(() => {
    const location = useLocation();

    return <div className="failure">
        <p><b>{location.state.fileName}</b> isn’t {location.state.action}ed.</p>
        <Link to="/">
            <Button style='secondary'>Retry</Button>
        </Link>
    </div>
});

export default Failure;