import { createTheme } from "@mui/material";
import type { Theme } from "@mui/material";

export const PlantTrackTheme: Theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#237d1e',
        },
        secondary: {
            main: '#2ca625',
        },
        action: {
            disabled: 'white'
        }
    },
})