import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: null,
        username: null,
        password: null,
        email: null,
    },
    reducers: {
        setName: (state, action) => {
            state.name = action.payload;
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        }
    },
})

export const { setName, setUsername, setEmail } = userSlice.actions

export default userSlice.reducer