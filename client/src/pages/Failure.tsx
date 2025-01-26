import { memo, useContext, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
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

    return (
        <div className="failure">
            <p className="failure__description">
                <b>{location.state.fileName}</b> wasn’t {location.state.action}ed. Check if the
                password or secret key is correct and try again.
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
