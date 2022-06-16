import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background:{
            default:"#29648E"
        }
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

export {
    darkTheme,
    lightTheme
};