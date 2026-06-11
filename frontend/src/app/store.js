import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'


const rootReducer = combineReducers({
  auth: authReducer
})


export const store = configureStore({
  reducer: rootReducer
})
