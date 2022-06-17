import { configureStore } from '@reduxjs/toolkit'
import cslice from './ConfigSlice'
import uslice from './UserSlice'
import rslice from './RequestSlice'

export default configureStore({
    reducer: {
        config: cslice,
        user: uslice,
        request: rslice
    }
});