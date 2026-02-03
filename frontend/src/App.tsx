import { Route, Routes } from "react-router-dom"
import Home from "./components/Home/Home"
import Register from "./components/User/Register";
import Login from "./components/User/Login";
import { ThemeProvider } from "@mui/material";
import { PlantTrackTheme } from "./components/common/Theme";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
    return (
        <ThemeProvider theme={PlantTrackTheme}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;