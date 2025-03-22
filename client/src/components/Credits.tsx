import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';

const Credits = () => (
    // FIXME Move link to the config
    <Link
        href="https://github.com/luxluxlux/cryptographer"
        target="_blank"
        rel="noopener"
        className="credits"
    >
        <div className="credits__text">We’re on GitHub</div>
        <GitHubIcon className="credits__icon" />
    </Link>
);

Credits.displayName = 'Credits';

export default Credits;
