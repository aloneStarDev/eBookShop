import { configureStore } from '@reduxjs/toolkit'
import cslice from './cslice'
export default configureStore({
    reducer: { cslice },
})