import { memo, useCallback, useEffect } from 'react';
import { Link as RouterLink, useLocation, Navigate } from 'react-router-dom';
import MuiLink from '@mui/material/Link';
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
        if (location.state) {
            download(location.state.data, location.state.fileName);
        }
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
                <Button component={RouterLink} to="/" variant="outlined">
                    Again
                </Button>
            </div>
            <div className="success__socials">
                <div className="success__socials-title">Tell your friends about us</div>
                <div className="success__socials-icons">
                    {/* FIXME Mark the socials forbidden in the Russian Federation and other countries */}
                    {/* TODO Make this list flexible for diffirent countries */}
                    {/* TODO Add the text description to the url params */}
                    <div className="success__socials-icons-links">
                        <RouterLink
                            to={'https://t.me/share/url?url=' + hostname}
                            target="_blank"
                            rel="noopener"
                        >
                            <img src={telegram} alt="Telegram logo" />
                        </RouterLink>
                        <RouterLink
                            to={'https://www.facebook.com/sharer/sharer.php?u=' + hostname}
                            target="_blank"
                            rel="noopener"
                        >
                            <img src={facebook} alt="Facebook logo" />
                        </RouterLink>
                        <RouterLink
                            to={'http://x.com/share?url=' + hostname}
                            target="_blank"
                            rel="noopener"
                        >
                            <img src={x} alt="X (Twitter) logo" />
                        </RouterLink>
                    </div>
                    <div className="success__socials-icons-attribution">
                        Designed by{' '}
                        <MuiLink href="https://freepik.com/" target="_blank" rel="noopener">
                            Freepic
                        </MuiLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

Success.displayName = 'Success';

export default memo(Success);
