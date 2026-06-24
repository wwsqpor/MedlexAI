import { combineReducers, configureStore } from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice.js'
import profileReducer from "../features/profile/profileSlice.js"
import dashboardReducer from "../features/dashboard/dashboardSlice.js"
import casesReducer from "../features/cases/casesSlice.js"
import userCasesReducer from "../features/userCases/userCasesSlice.js"
import aiTutorReducer from "../features/aiTutor/aiTutorSlice.js"
import {
  logout
} from "../features/auth/authThunks.js"


const appReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  dashboard: dashboardReducer,
  cases: casesReducer,
  userCases: userCasesReducer,
  aiTutor: aiTutorReducer 
})

const rootReducer = (state, action) => {
  if (action.type === logout.fulfilled.type) {
    console.log("Store reset");
    state = undefined;
  }

  return appReducer(state, action); 
}

export const store = configureStore({
  reducer: rootReducer
})
