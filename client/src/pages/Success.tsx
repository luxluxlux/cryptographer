import { memo, useCallback, useEffect, useRef } from 'react';
import { Link as RouterLink, useLocation, Navigate } from 'react-router-dom';
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import { download, ellipse, wait } from 'utils/common';
import { BREAKPOINT, useBreakpoint } from 'utils/breakpoints';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const SHARED_TEXT =
    'I protect my files with a password using Cryptographer. Protect your files too!';

const Success = () => {
    const isDesktop = useBreakpoint(BREAKPOINT.S);
    const location = useLocation();
    const hostname = window.location.hostname;
    const rootRef = useRef(null);

    const handleClick = useCallback(() => {
        download(location.state.data, location.state.fileName);
    }, [location.state]);

    useEffect(() => {
        if (location.state) {
            (async () => {
                // TODD Add check that the current page doesn't change
                // Give the user some time to read the result
                await wait(isDesktop ? 1000 : 2000);
                // Download file only if user is still on this page
                if (rootRef.current) {
                    download(location.state.data, location.state.fileName);
                }
            })();
        }
    }, []);

    if (!location.state) {
        return <Navigate to="/" replace />;
    }

    return (
        <div ref={rootRef} className="success">
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
                {/*
                    Don't use URLSearchParams, it replaces spaces with '+'.
                    It can cause problems, for example, in Telegram.
                */}
                <div className="success__socials-links">
                    <MuiLink
                        className="success__socials-links-link"
                        href={`https://t.me/share/url?url=${hostname}&text=${SHARED_TEXT}`}
                        target="_blank"
                        rel="noopener"
                        title="Telegram"
                    >
                        <TelegramIcon fontSize="small" />
                    </MuiLink>
                    <MuiLink
                        className="success__socials-links-link"
                        href={`https://wa.me/?text=${hostname}%0A${SHARED_TEXT}`}
                        target="_blank"
                        rel="noopener"
                        title="WhatsApp"
                    >
                        <WhatsAppIcon fontSize="small" />
                    </MuiLink>
                    <MuiLink
                        className="success__socials-links-link"
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${hostname}&text=${SHARED_TEXT}`}
                        target="_blank"
                        rel="noopener"
                        title="LinkedIn"
                    >
                        <LinkedInIcon fontSize="small" />
                    </MuiLink>
                </div>
            </div>
        </div>
    );
};

Success.displayName = 'Success';

export default memo(Success);
