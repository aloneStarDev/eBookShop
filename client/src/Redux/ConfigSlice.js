import { createSlice } from '@reduxjs/toolkit'

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    theme: localStorage.getItem('theme') ?? 'light',
    sideMenu: false,
    jwt: localStorage.getItem('jwt'),
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.theme);
    },
    toggleSideMenu: (state) => {
      state.sideMenu = !state.sideMenu;
    },
    setJwt: (state, action) => {
      if (action.payload === null)
        localStorage.removeItem('jwt');
      else
        localStorage.setItem("jwt", action.payload);
      state.jwt = action.payload
    },
  },
})

export const { toggleTheme, toggleSideMenu, setJwt } = configSlice.actions

export default configSlice.reducer