import { Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { getUserAgent } from 'utils/device';
import {
    APPLICATION_NAME,
    APPLICATION_URL,
    REACT_SNAP_PATHS,
    STAGE,
    STAGE_DATA,
} from 'utils/constants';
import theme from 'utils/theme';
import Upload from 'pages/Upload';
import Secure from 'pages/Secure';
import Download from 'pages/Download';
import NotFound from 'pages/NotFound';
import { SnackbarProvider } from 'components/Snackbar';
import { Page } from 'components/Page';
import Logo from 'components/Logo';
import Menu from 'components/Menu';
import Credits from 'components/Credits';
import './App.scss';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';

const OG_IMAGE = `${APPLICATION_URL}preview.png`;

const App = () => (
    <HelmetProvider>
        <Helmet>
            <title>{APPLICATION_NAME}</title>
            <meta name="theme-color" content="#070707" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={APPLICATION_NAME} />
            <meta property="og:image" content={OG_IMAGE} />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={OG_IMAGE} />
            {/* TODO: Create Twitter acoount and add twitter:site and twitter:creator tags */}
        </Helmet>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <SnackbarProvider>
                    <Page
                        logo={<Logo />}
                        menu={<Menu />}
                        footer={<Credits />}
                        content={
                            <Routes>
                                <Route path={STAGE_DATA[STAGE.UPLOAD].path} Component={Upload} />
                                <Route path={STAGE_DATA[STAGE.SECURE].path} Component={Secure} />
                                <Route
                                    path={STAGE_DATA[STAGE.DOWNLOAD].path}
                                    Component={Download}
                                />
                                {/* 
                                    These pages are prepared only for react-snap because it don't
                                    handle URL params
                                */}
                                {getUserAgent() === 'ReactSnap' &&
                                    REACT_SNAP_PATHS.map((path) => (
                                        <Route key={path} path={path} Component={Upload} />
                                    ))}
                                <Route path="*" Component={NotFound} />
                            </Routes>
                        }
                    />
                </SnackbarProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    </HelmetProvider>
);

App.displayName = 'App';

export default App;
