import { memo, useCallback, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { download, ellipse } from 'utils/common';
import telegram from 'resources/socials/telegram.svg';
import facebook from 'resources/socials/facebook.svg';
import x from 'resources/socials/x.svg';

const Success = () => {
    const location = useLocation();
    const hostname = window.location.hostname;

    const handleClick = useCallback(() => {
        download(location.state.data, location.state.fileName);
    }, [location.state]);

    useEffect(() => {
        download(location.state.data, location.state.fileName);
    }, []);

    if (!location.state) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="success">
            <p className="success__description">
                <b title={location.state.fileName}>{ellipse(location.state.fileName, 40)}</b> was
                successfully {location.state.action}ed and downloaded. If not, use the button below.
            </p>
            <div className="success__actions">
                <Button variant="contained" onClick={handleClick}>
                    Download
                </Button>
                <Button component={Link} to="/" variant="outlined">
                    Again
                </Button>
            </div>
            <div className="success__socials">
                <div className="success__socials-title">Tell your friends about us</div>
                {/* FIXME Mark the socials forbidden in the Russian Federation and other countries */}
                {/* TODO Add the text description to the url params */}
                {/* TODO Make this list flexible for diffirent countries */}
                <div className="success__socials-icons">
                    <Link
                        to={'https://t.me/share/url?url=' + hostname}
                        target="_blank"
                        rel="noopener"
                    >
                        <img src={telegram} alt="Telegram logo" />
                    </Link>
                    <Link
                        to={'https://www.facebook.com/sharer/sharer.php?u=' + hostname}
                        target="_blank"
                        rel="noopener"
                    >
                        <img src={facebook} alt="Facebook logo" />
                    </Link>
                    <Link to={'http://x.com/share?url=' + hostname} target="_blank" rel="noopener">
                        <img src={x} alt="X (Twitter) logo" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

Success.displayName = 'Success';

export default memo(Success);
