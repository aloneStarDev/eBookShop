import { createSlice } from '@reduxjs/toolkit'

export const storageSlice = createSlice({
    name: 'storage',
    initialState: {
        fs: [],
        path: "/",
        current: [],
    },
    reducers: {
        setFs: (state, action) => {
            state.fs = action.payload;
            state.current = action.payload.filter(x => x.vpath === state.path).map(x => {
                return { ...x, checked: false, menu: false }
            });
        },
        cd: (state, action) => {
            state.path = action.payload;
            state.current = state.fs.filter(x => x.vpath === state.path).map(x => {
                return { ...x, checked: false, menu: false }
            });
        },
        toggleSelectItem: (state, action) => {
            let findex = state.current.findIndex(x => x._id === action.payload.fid);
            state.current[findex].checked = !state.current[findex].checked
        },
        unSelectAllItems: (state) => {
            for (let i = 0; i < state.current.length; i++)
                state.current[i].checked = false;
        },
        toggleMenuItem: (state, action) => {
            let findex = state.current.findIndex(x => x._id === action.payload.fid);
            state.current[findex].menu = !state.current[findex].menu
        },
    },
})

export const { setFs, toggleMenuItem, toggleSelectItem, cd, toggleAllSelectedItem, unSelectAllItems } = storageSlice.actions

export default storageSlice.reducer