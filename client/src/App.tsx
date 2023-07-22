import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lobby from "pages/Lobby";
import Password from "pages/Password";
import Success from "pages/Success";
import Failure from "pages/Failure";
import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/password" element={<Password />} />
          <Route path="/success" element={<Success />} />
          <Route path="/failure" element={<Failure />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
