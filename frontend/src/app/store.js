import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import profileReducer from "../features/profile/profileSlice.js"
import dashboardReducer from "../features/dashboard/dashboardSlice.js"
import casesReducer from "../features/cases/casesSlice.js"
import userCasesReducer from "../features/userCases/userCasesSlice.js"


const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  dashboard: dashboardReducer,
  cases: casesReducer,
  userCases: userCasesReducer
})


export const store = configureStore({
  reducer: rootReducer
})
