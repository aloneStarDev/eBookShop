import { createSlice } from '@reduxjs/toolkit'

export const storageSlice = createSlice({
    name: 'storage',
    initialState: {
        fs: [],
        path: "/",
        current_parent: "/",
        current: [],
    },
    reducers: {
        setFs: (state, action) => {
            state.fs = action.payload;
            state.current = action.payload.filter(x => x.parent === state.current_parent).map(x => {
                return { ...x, checked: false, menu: false, downloadValue: 0 }
            });
        },
        cd: (state, action) => {
            const complete_path = (fid, current_path) => {
                if (fid === "/")
                    return "/";
                let item = state.fs.find(x => x._id === fid);
                if (item.parent === "/") {
                    if (current_path === undefined)
                        return "/" + item.name;
                    else
                        return "/" + item.name + "/" + current_path;
                }
                else {
                    if (current_path === undefined)
                        return complete_path(item.parent, item.name);
                    else
                        return complete_path(item.parent, item.name + "/" + current_path);
                }
            }
            state.path = complete_path(action.payload);
            state.current_parent = action.payload;
            state.current = state.fs.filter(x => x.parent === action.payload).map(x => {
                return { ...x, checked: false, menu: false, downloadValue: 0 }
            });
        },
        setDownloadValue: (state, action) => {
            state.current = state.current.map(x => {
                if (x._id === action.payload.fid) {
                    x.downloadValue = action.payload.value;
                }
                return x;
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

export const { setFs, toggleMenuItem, toggleSelectItem, cd, toggleAllSelectedItem, unSelectAllItems, setDownloadValue } = storageSlice.actions

export default storageSlice.reducer