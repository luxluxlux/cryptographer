import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '@mui/material/Button';
import { Header } from 'components/Page';
import { APPLICATION_NAME, STAGE, STAGE_DATA } from 'utils/constants';

const NotFound = () => (
    <>
        <Helmet>
            <title>{APPLICATION_NAME} | 404 - Page Not Found</title>
            <meta name="robots" content="noindex" />
        </Helmet>
        <Header
            metaTitle={`${APPLICATION_NAME} — 404 Page Not Found`}
            metaDescription={`The page you are looking for could not be found on ${APPLICATION_NAME}.`}
        />
        <div className="not-found">
            <h2 className="not-found__title">Oops! 404 - Page not found</h2>
            <p className="not-found__description">
                The page packed up its bits and left. We&apos;re still trying to decrypt its last
                message.
            </p>
            <Button component={Link} to={STAGE_DATA[STAGE.UPLOAD].path} variant="contained">
                Go home
            </Button>
        </div>
    </>
);

NotFound.displayName = 'NotFound';

export default NotFound;
