import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: "#0A1929",
            secondary:"#33577d",
            primary:"#02664b",
        },
        text:{
            primary:"#fff"
        },
    },
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background:{ 
            secondary:"#49a9b8",
            primary:"#5afacf"
        },
    },
});

export {
    darkTheme,
    lightTheme
};