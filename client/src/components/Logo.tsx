import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import MuiLink from '@mui/material/Link';
import logo from 'resources/logo.svg';

const Logo = () => (
    <nav>
        <MuiLink component={RouterLink} to="/" className="logo">
            <img className="logo__image" src={logo} alt="Logo" />
            <h1 className="logo__text">Cryptographer</h1>
        </MuiLink>
    </nav>
);

Logo.displayName = 'Logo';

export default memo(Logo);
