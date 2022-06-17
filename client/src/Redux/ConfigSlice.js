import { createSlice } from '@reduxjs/toolkit'

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    theme: localStorage.getItem('theme') ?? 'light',
    sideMenu: false,
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", state.theme);
    },
    toggleSideMenu: (state) => {
      state.sideMenu = !state.sideMenu;
    },
  },
})

export const { toggleTheme, toggleSideMenu } = configSlice.actions

export default configSlice.reducer