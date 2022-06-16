import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const baseurl = "http://";

const login = createAsyncThunk(
    'user/login',
    async (data, thunkAPI) => {
        console.log(data)
        // const response = await fetch(`${baseurl}/api/user/login`, {
        //     method: 'POST',
        //     body: JSON.stringify({ username, password }),
        //     headers: { 'Content-Type': 'application/json' },
        // });
        // const result = response.json();
        // console.log(result);
        // return response.data
    }
)

export const requestSlice = createSlice({
    name: 'request',
    initialState: {
    },
    reducers: {

    }, extraReducers: builder => {
        builder.addCase(login.fulfilled, login.rejected, login.pending, (state, action) => {
            return;
        })
    }
})

export { login }

export default requestSlice.reducer