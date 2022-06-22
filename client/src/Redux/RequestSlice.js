import { createSlice } from '@reduxjs/toolkit'

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
        list_user: (state) => {
            state.route = BASE_URL + "/api/user/list";
            state.auth = true;
            state.method = "POST";
        },
        edit_user: (state, action) => {
            state.route = BASE_URL + "/api/user/edit";
            state.auth = true;
            state.method = "PATCH";
            state.data = action.payload;
        },
        remove_user: (state, action) => {
            state.route = BASE_URL + "/api/user/remove";
            state.auth = true;
            state.method = "POST";
            state.data = action.payload;
        },
        add_user: (state, action) => {
            state.route = BASE_URL + "/api/user/add";
            state.auth = true;
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
        get_fobject_list: (state, action) => {
            state.route = BASE_URL + "/api/fobject/list";
            state.auth = true;
            state.method = "POST";
        },
        create_folder: (state, action) => {
            state.route = BASE_URL + "/api/fobject/folder/add";
            state.auth = true;
            state.method = "POST";
            state.data = action.payload
        },
        remove_fobject: (state, action) => {
            state.route = BASE_URL + "/api/fobject/remove";
            state.auth = true;
            state.method = "POST";
            state.data = action.payload;
        },
        response: (state, action) => {
            state.response = action.payload;
        }
    },
})

export const {
    setJwt,
    login,
    register,
    response,
    verify,
    add_user,
    edit_user,
    list_user,
    remove_user,
    get_fobject_list,
    create_folder,
    remove_fobject,
} = requestSlice.actions

export default requestSlice.reducer