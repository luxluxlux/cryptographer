import { Link as RouterLink } from 'react-router-dom';
import MuiLink from '@mui/material/Link';
import logo from 'resources/logo.svg';
import { APPLICATION_NAME, STAGE, STAGE_DATA } from 'utils/constants';

/**
 * Main page logo.
 * @returns Image and name of the app.
 */
const Logo = () => (
    <nav aria-label="Website Logo">
        <MuiLink component={RouterLink} to={STAGE_DATA[STAGE.UPLOAD].path} className="logo">
            <img className="logo__image" src={logo} alt="Emblem" />
            <h1 className="logo__text">{APPLICATION_NAME}</h1>
        </MuiLink>
    </nav>
);

Logo.displayName = 'Logo';

export default Logo;
