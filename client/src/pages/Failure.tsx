import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from 'components/Header';
import Button from 'components/Button';

// TODO Rename to "Fail"
const Failure = memo(() => {
    const location = useLocation();

    return <div className="failure">
        <Header color='error'>Failure</Header>
        <p><b>{location.state.fileName}</b> isn’t {location.state.action}ed.</p>
        <Link to="/">
            <Button color='secondary'>Retry</Button>
        </Link>
    </div>
});

export default Failure;