import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import { GITHUB_URL } from 'utils/constants';

/**
 * Links to our accounts on external services.
 * @returns The list of our external pages.
 */
const Credits = () => (
    <Link href={GITHUB_URL} target="_blank" rel="noopener" className="credits">
        <div className="credits__text">We&apos;re on GitHub</div>
        <GitHubIcon className="credits__icon" />
    </Link>
);

Credits.displayName = 'Credits';

export default Credits;
