import { createSlice } from '@reduxjs/toolkit'
let initialState = localStorage.getItem("user") ? { data: JSON.parse(localStorage.getItem("user")) } : {
    data: {
        _id: null,
        name: null,
        username: null,
        email: null,
        role: 0,
    }
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            if (action.payload === null) {
                localStorage.removeItem("user");
                state.data = {
                    _id: null,
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
            for (let k in data) {
                state.data[k] = data[k];
            }
            localStorage.setItem("user", JSON.stringify(state.data))
        }
    },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer