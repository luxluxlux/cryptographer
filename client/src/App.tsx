import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { PATH } from 'utils/constants';
import theme from 'utils/theme';
import Lobby from 'pages/Lobby';
import Password from 'pages/Password';
import Success from 'pages/Success';
import Failure from 'pages/Failure';
import Base from 'components/Base';
import Logo from 'components/Logo';
import Menu from 'components/Menu';
import Credits from 'components/Credits';
import Stage from 'components/Stage';
import './App.scss';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';

function App() {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
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
                            <Route path={PATH.ERROR} element={<Failure />} />
                        </Routes>
                    }
                />
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

App.displayName = 'App';

export default App;
