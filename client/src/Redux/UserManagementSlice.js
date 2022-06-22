import { createSlice } from '@reduxjs/toolkit'

export const userManagementSlice = createSlice({
    name: 'users',
    initialState: { data: [] },
    reducers: {
        setUsers: (state, action) => {
            state.data = action.payload;
        },
        checkUser: (state, action) => {
            state.data = state.data.map(x => {
                if (x.username === action.payload.username)
                    x.checked = action.payload.value;
                return x;
            })
        }, checkAllUser: (state, action) => {
            state.data = state.data.map(x => { return { ...x, checked: action.payload.value } });
        }
    }
})

export const { setUsers, checkUser,checkAllUser } = userManagementSlice.actions

export default userManagementSlice.reducer