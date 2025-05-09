import { memo, useCallback, useEffect } from 'react';
import { Link as RouterLink, useLocation, Navigate, useNavigate } from 'react-router-dom';
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { APPLICATION_NAME } from 'utils/constants';
import { download, ellipse } from 'utils/common';

const SHARED_TEXT = `I protect my files with a password using ${APPLICATION_NAME}. Protect your files too!`;

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const hostname = window.location.hostname;

    const downloadFile = useCallback(() => {
        download(location.state.data, location.state.fileName);
        navigate('/success', {
            state: {
                ...location.state,
                downloaded: true,
            },
        });
    }, [location.state]);

    useEffect(() => {
        if (!location.state || location.state.downloaded) {
            return;
        }
        // Give the user some time to read the result
        const timeout = setTimeout(() => {
            downloadFile();
        }, 2000);
        return () => clearTimeout(timeout);
    }, [location.state]);

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
                <Button variant="contained" onClick={downloadFile}>
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
