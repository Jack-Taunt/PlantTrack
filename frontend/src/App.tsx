import { Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@mui/material";
import { PlantTrackTheme } from "./components/common/Theme";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Home from "./components/Home/Home"
import Register from "./components/User/Register";
import Login from "./components/User/Login";
import Gardens from "./components/Garden/my-gardens"
import CreateGarden from "./components/Garden/create-garden"

function App() {
    return (
        <ThemeProvider theme={PlantTrackTheme}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/gardens" element={<Gardens />} />
                <Route path="/gardens/create" element={<CreateGarden />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;