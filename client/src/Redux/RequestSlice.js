import { createSlice } from '@reduxjs/toolkit'

const request = {}
const BASE_URL = "";
export const requestSlice = createSlice({
    name: 'request',
    initialState: {
        jwt: localStorage.getItem('jwt'),
        auth: false,
        method: 'POST',
        route: "",
        data: {},
        response: {}
    },
    reducers: {
        login: (state, action) => {
            state.route = BASE_URL + "/api/user/login";
            state.method = "POST";
            state.auth = false;
            state.data = action.payload;
        },
        register: (state, action) => {
            state.route = BASE_URL + "/api/user/register";
            state.auth = false;
            state.method = "POST";
            state.data = action.payload;
        },
        verify: (state, action) => {
            state.route = BASE_URL + "/api/user/verify";
            state.auth = false;
            state.method = "POST";
            state.data = action.payload;
        },
        setJwt: (state, action) => {
            if (action.payload === null)
                localStorage.removeItem('jwt');
            else
                localStorage.setItem("jwt", action.payload);
            state.jwt = action.payload
        },
        response: (state, action) => {
            state.response = action.payload;
        }
    },
})

export const { setJwt, login, register, response,verify } = requestSlice.actions

export default requestSlice.reducer