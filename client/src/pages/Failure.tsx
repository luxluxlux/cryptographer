import { memo, useContext, useCallback } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { MAX_ELLIPSED_FILENAME_LENGTH } from 'utils/constants';
import { ellipse } from 'utils/common';
import { WindowManagerContext } from 'utils/windows';
import WhatsWrong from 'windows/WhatsWrong';

// TODO Rename to "Fail"
// FIXME Sickening background color transition to blue
const Failure = () => {
    const location = useLocation();

    const windowContext = useContext(WindowManagerContext);

    const handleAboutClick = useCallback(() => {
        windowContext.open(<WhatsWrong />);
    }, [windowContext.open]);

    if (!location.state) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="failure">
            <p className="failure__description">
                <b title={location.state.fileName}>
                    {ellipse(location.state.fileName, MAX_ELLIPSED_FILENAME_LENGTH)}
                </b>{' '}
                wasn’t {location.state.action}ed. Check if the password or secret key is correct and
                try again.
            </p>
            <Button onClick={handleAboutClick}>What’s wrong?</Button>
            <Button component={Link} to="/" variant="contained">
                Retry
            </Button>
        </div>
    );
};

Failure.displayName = 'Failure';

export default memo(Failure);
