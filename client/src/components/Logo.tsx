import { memo } from 'react';
import { Link } from 'react-router-dom';
import logo from 'resources/logo.svg';

const Logo = () => (
    <Link to="/" className="logo">
        <img className="logo__image" src={logo} alt="Logo" />
        <h1 className="logo__text">Cryptographer</h1>
    </Link>
);

Logo.displayName = 'Logo';

export default memo(Logo);
