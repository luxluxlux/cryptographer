import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { getUserAgent } from 'utils/device';
import { STAGE, STAGE_DATA } from 'utils/constants';
import theme from 'utils/theme';
import Upload from 'pages/Upload';
import Secure from 'pages/Secure';
import Download from 'pages/Download';
import { SnackbarProvider } from 'components/Snackbar';
import { WINDOW_DATA } from 'components/WindowManager';
import Base from 'components/Base';
import Logo from 'components/Logo';
import Menu from 'components/Menu';
import Credits from 'components/Credits';
import './App.scss';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';

const POPUP_PATHS = Object.values(WINDOW_DATA).map(({ path }) => path);
const REACT_SNAP_PATHS = ['mobile', ...POPUP_PATHS.flatMap((path) => [path, `mobile/${path}`])];

const App = () => (
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <SnackbarProvider>
                <Base
                    logo={<Logo />}
                    menu={<Menu />}
                    footer={<Credits />}
                    content={
                        <Routes>
                            <Route path={STAGE_DATA[STAGE.UPLOAD].path} element={<Upload />} />
                            <Route path={STAGE_DATA[STAGE.SECURE].path} element={<Secure />} />
                            <Route path={STAGE_DATA[STAGE.DOWNLOAD].path} element={<Download />} />
                            {/* 
                                These pages are prepared only for react-snap because it don't
                                handle URL params
                            */}
                            {getUserAgent() === 'ReactSnap' &&
                                REACT_SNAP_PATHS.map((path) => (
                                    <Route key={path} path={path} element={<Upload />} />
                                ))}
                        </Routes>
                    }
                />
            </SnackbarProvider>
        </ThemeProvider>
    </StyledEngineProvider>
);

App.displayName = 'App';

export default App;
