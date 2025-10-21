import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import MuiLink from '@mui/material/Link';
import logo from 'resources/logo.svg';
import { APPLICATION_NAME, STAGE, STAGE_DATA } from 'utils/constants';

const Logo = () => (
    <nav aria-label="Website Logo">
        <MuiLink component={RouterLink} to={STAGE_DATA[STAGE.UPLOAD].path} className="logo">
            <img className="logo__image" src={logo} alt="Logo Image" />
            <h1 className="logo__text">{APPLICATION_NAME}</h1>
        </MuiLink>
    </nav>
);

Logo.displayName = 'Logo';

export default memo(Logo);
