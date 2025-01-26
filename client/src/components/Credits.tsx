import { Link } from 'react-router-dom';
import github from 'resources/github.svg';

const Credits = () => (
    // FIXME Move link to the config
    // TODO Maybe use button
    <Link
        to="https://github.com/luxluxlux/cryptographer"
        target="_blank"
        rel="noopener"
        className="credits"
    >
        <div className="credits__text">We’re on GitHub</div>
        <img src={github} alt="GitHub logo" />
    </Link>
);

Credits.displayName = 'Credits';

export default Credits;
