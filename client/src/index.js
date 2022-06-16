import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { darkTheme, lightTheme } from './Theme';
import store from './Redux/Store'
import { ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
const root = ReactDOM.createRoot(document.getElementById('root'));
function Init() {
  const [theme, setTheme] = useState(lightTheme);
  let thm = useSelector(state => state.config.theme);
  useEffect(() => {
    if (thm === "light")
      setTheme(lightTheme);
    else if (thm === "dark")
      setTheme(darkTheme);
  }, [thm]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Init />
    </Provider>
  </React.StrictMode>
);

reportWebVitals(console.log);
