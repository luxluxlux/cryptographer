import { memo, useCallback, useEffect } from 'react';
import { Link as RouterLink, useLocation, Navigate } from 'react-router-dom';
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import { download, ellipse, wait } from 'utils/common';
import { BREAKPOINT, useBreakpoint } from 'utils/breakpoints';
import TelegramIcon from '@mui/icons-material/Telegram';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';

const Success = () => {
    const isDesktop = useBreakpoint(BREAKPOINT.S);
    const location = useLocation();
    const hostname = window.location.hostname;

    const handleClick = useCallback(() => {
        download(location.state.data, location.state.fileName);
    }, [location.state]);

    useEffect(() => {
        if (location.state) {
            (async () => {
                // TODD Add check that the current page doesn't change
                // Give the user some time to read the result
                await wait(isDesktop ? 1000 : 2000);
                download(location.state.data, location.state.fileName);
            })();
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
                {/* FIXME Mark the socials forbidden in the Russian Federation and other countries */}
                {/* TODO Make this list flexible for diffirent countries */}
                {/* TODO Add the text description to the url params */}
                <div className="success__socials-links">
                    <MuiLink
                        className="success__socials-links-link"
                        href={'https://t.me/share/url?url=' + hostname}
                        target="_blank"
                        rel="noopener"
                    >
                        <TelegramIcon fontSize="small" />
                    </MuiLink>
                    <MuiLink
                        className="success__socials-links-link"
                        href={'https://www.facebook.com/sharer/sharer.php?u=' + hostname}
                        target="_blank"
                        rel="noopener"
                    >
                        <FacebookIcon fontSize="small" />
                    </MuiLink>
                    <MuiLink
                        className="success__socials-links-link"
                        href={'http://x.com/share?url=' + hostname}
                        target="_blank"
                        rel="noopener"
                    >
                        <XIcon fontSize="small" />
                    </MuiLink>
                </div>
            </div>
        </div>
    );
};

Success.displayName = 'Success';

export default memo(Success);
