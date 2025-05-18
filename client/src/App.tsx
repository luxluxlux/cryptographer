import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { APPLICATION_NAME, PATH } from 'utils/constants';
import { isProduction } from 'utils/common';
import theme from 'utils/theme';
import Lobby from 'pages/Lobby';
import Password from 'pages/Password';
import Success from 'pages/Success';
import { SnackbarProvider } from 'components/Snackbar';
import { EnqueueSnackbar } from 'components/Snackbar/interfaces';
import Base from 'components/Base';
import Logo from 'components/Logo';
import Menu from 'components/Menu';
import Credits from 'components/Credits';
import Stage from 'components/Stage';
import './App.scss';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';

function App() {
    useEffect(() => {
        if (isProduction()) {
            (enqueueSnackbar as EnqueueSnackbar)({
                variant: 'warning',
                autoHideDuration: null,
                title: 'Not for real use!',
                message: (
                    <>
                        This is a development build of {APPLICATION_NAME}.{' '}
                        <strong>Do not use it to encrypt real files!</strong> Encrypted data will be
                        lost.
                    </>
                ),
            });
        }
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <SnackbarProvider>
                    <Base
                        logo={<Logo />}
                        menu={<Menu />}
                        footer={<Credits />}
                        stage={<Stage />}
                        content={
                            <Routes>
                                <Route path={PATH.UPLOAD} element={<Lobby />} />
                                <Route path={PATH.KEY} element={<Password />} />
                                <Route path={PATH.SUCCESS} element={<Success />} />
                            </Routes>
                        }
                    />
                </SnackbarProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

App.displayName = 'App';

export default App;
