import { createSlice } from "@reduxjs/toolkit";

import { 
  fetchUserCaseSessions,
  startUserCaseSession,
  fetchUserCaseSessionDetails,
  submitAnswer
  // fetchUserCaseSessionTasks
} from "./userCasesThunks";


const initialState = {
  userCaseSessions: [],
  currentSession: null,
  currentSessionStatus: "idle",
  submitAnswerStatus: "idle",
  status: "idle",
  error: ""
}

const userCases = createSlice({
  name: "userCases",
  initialState,

  reducers: {

  },

  extraReducers: (builder) => {
    builder
    .addCase(fetchUserCaseSessions.pending, (state) => {
      state.status = "loading";
      state.error = ""
    })
    .addCase(fetchUserCaseSessions.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(fetchUserCaseSessions.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.userCaseSessions = action.payload;
    })
    .addCase(startUserCaseSession.pending, (state) => {
      state.currentSessionStatus = "loading";
      state.error = "";
    })
    .addCase(startUserCaseSession.rejected, (state, action) => {
      state.currentSessionStatus = "failed";
      state.error = action.payload;
    })
    .addCase(startUserCaseSession.fulfilled, (state, action) => {
      state.currentSessionStatus = "succeeded";
      state.currentSession = action.payload;
    })
    .addCase(fetchUserCaseSessionDetails.pending, (state) => {
      state.currentSessionStatus = "loading";
      state.error = "";
    })
    .addCase(fetchUserCaseSessionDetails.rejected, (state, action) => {
      state.currentSessionStatus = "failed";
      state.error = action.payload;
    })
    .addCase(fetchUserCaseSessionDetails.fulfilled, (state, action) => {
      state.currentSessionStatus = "succeeded";
      state.currentSession = action.payload;
    })
    .addCase(submitAnswer.pending, (state) => {
      state.submitAnswerStatus = "loading";
      state.error = "";
    })
    .addCase(submitAnswer.rejected, (state, action) => {
      state.submitAnswerStatus = "failed";
      state.error = action.payload;
    })
    .addCase(submitAnswer.fulfilled, (state, action) => {
      state.submitAnswerStatus = "succeeded";
      // state.currentSession.answers.push(action.payload);
    })
  }
})


export default userCases.reducer;