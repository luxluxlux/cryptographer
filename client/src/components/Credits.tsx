import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import { GITHUB_URL } from 'utils/constants';

const Credits = () => (
    <Link href={GITHUB_URL} target="_blank" rel="noopener" className="credits">
        <div className="credits__text">We’re on GitHub</div>
        <GitHubIcon className="credits__icon" />
    </Link>
);

Credits.displayName = 'Credits';

export default Credits;
