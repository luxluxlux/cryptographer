import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { STAGE, STAGE_DATA } from 'utils/constants';
import theme from 'utils/theme';
import Lobby from 'pages/Lobby';
import Password from 'pages/Password';
import Success from 'pages/Success';
import { SnackbarProvider } from 'components/Snackbar';
import Base from 'components/Base';
import Logo from 'components/Logo';
import Menu from 'components/Menu';
import Credits from 'components/Credits';
import './App.scss';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';

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
                            <Route path={STAGE_DATA[STAGE.UPLOAD].path} element={<Lobby />} />
                            <Route path={STAGE_DATA[STAGE.KEY].path} element={<Password />} />
                            <Route path={STAGE_DATA[STAGE.SUCCESS].path} element={<Success />} />
                        </Routes>
                    }
                />
            </SnackbarProvider>
        </ThemeProvider>
    </StyledEngineProvider>
);

App.displayName = 'App';

export default App;
