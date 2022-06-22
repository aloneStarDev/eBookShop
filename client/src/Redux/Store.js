import { configureStore } from '@reduxjs/toolkit'
import cslice from './ConfigSlice'
import uslice from './UserSlice'
import umslice from './UserManagementSlice'
import rslice from './RequestSlice'
import sslice from './StorageSlice'

export default configureStore({
    reducer: {
        config: cslice,
        user: uslice,
        users: umslice,
        request: rslice,
        storage: sslice
    }
});