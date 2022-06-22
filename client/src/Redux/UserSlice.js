import { createSlice } from '@reduxjs/toolkit'
let initialState = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {
    name: null,
    username: null,
    email: null,
    role: 0,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            if (action.payload === null) {
                localStorage.removeItem("user");
                state = {
                    name: null,
                    username: null,
                    email: null,
                    role: 0,
                };
                return;
            }
            let data = {
                ...action.payload
            };
            if (data.hasOwnProperty("password"))
                delete data.password;
            let x = {
                ...state,
                ...data
            };
            state = {
                ...x
            };
            localStorage.setItem("user", JSON.stringify(state));
        }
    },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer