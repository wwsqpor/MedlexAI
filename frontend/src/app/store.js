import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import profileReducer from "../features/profile/profileSlice.js"
import dashboardReducer from "../features/dashboard/dashboardSlice.js"


const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  dashboard: dashboardReducer,
  
})


export const store = configureStore({
  reducer: rootReducer
})
