import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import Register from "./pages/User/Register";
import Login from "./pages/User/Login";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;