import { createSlice } from '@reduxjs/toolkit'
let initialState = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {
    name: null,
    username: null,
    email: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            localStorage.setItem("user",JSON.stringify(action.payload));
            state = {
                ...state,
                ...action.payload
            };
        }
    },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer