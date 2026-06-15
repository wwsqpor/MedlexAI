import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import profileReducer from "../features/profile/profileSlice.js"


const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer
})


export const store = configureStore({
  reducer: rootReducer
})
