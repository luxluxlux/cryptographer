import { Routes, Route } from 'react-router-dom';
import Lobby from 'pages/Lobby';
import Password from 'pages/Password';
import Success from 'pages/Success';
import Failure from 'pages/Failure';
import Background from 'components/Background';
import Logo from 'components/Logo';
import './App.scss';

function App() {
    return (
        <div className="page">
            <Background />
            <div className="page__content">
                <Logo />
                <Routes>
                    <Route path="/" element={<Lobby />} />
                    <Route path="/password" element={<Password />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/failure" element={<Failure />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
