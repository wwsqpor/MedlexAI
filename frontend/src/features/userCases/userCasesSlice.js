import { createSlice } from "@reduxjs/toolkit";

import { 
  fetchUserCaseSessions,
  startUserCaseSession,
  fetchUserCaseSessionDetails,
  submitAnswer,
  completeCase,
  fetchUserCaseSessionResult
  // fetchUserCaseSessionTasks
} from "./userCasesThunks";


const initialState = {
  userCaseSessions: [],

  currentSession: null,
  currentSessionStatus: "idle",
  
  submitAnswerStatus: "idle",

  userAnswers: {},

  result: null,
  resultStatus: "idle",

  status: "idle",
  error: ""
}

const userCases = createSlice({
  name: "userCases",
  initialState,

  reducers: {
    addAnswer: (state, action) => {
      const { attempt_id, task_id } = action.payload;
      console.log(action.payload);
      state.userAnswers[`${attempt_id}-${task_id}`] = action.payload;
    }
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
      state.resultStatus = "loading";
      state.error = "";
    })
    .addCase(fetchUserCaseSessionDetails.rejected, (state, action) => {
      state.currentSessionStatus = "failed";
      state.resultStatus = "failed";
      state.error = action.payload;
    })
    .addCase(fetchUserCaseSessionDetails.fulfilled, (state, action) => {
      state.currentSessionStatus = "succeeded";
      state.currentSession = action.payload;
      state.result = {
        attempt_id: action.payload.id,
        case: action.payload.case.title,
        total_score: action.payload.total_score,
        status: action.payload.status,
        completed_at: action.payload.completed_at,
      }
      state.resultStatus = "succeeded";
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
    .addCase(completeCase.pending, (state) => {
      state.resultStatus = "loading";
      state.error = "";
    })
    .addCase(completeCase.rejected, (state, action) => {
      state.resultStatus = "failed";
      state.error = action.payload;
    })
    .addCase(completeCase.fulfilled, (state, action) => {
      state.resultStatus = "succeeded";
      state.result = action.payload;
    })
    .addCase(fetchUserCaseSessionResult.pending, (state) => {
      state.resultStatus = "loading";
      state.error = "";
    })
    .addCase(fetchUserCaseSessionResult.rejected, (state, action) => {
      state.resultStatus = "failed";
      state.error = action.payload;
    })
    .addCase(fetchUserCaseSessionResult.fulfilled, (state, action) => {
      state.resultStatus = "succeeded";
      state.result = action.payload;
    })
  }
})


export default userCases.reducer;
export const { addAnswer } = userCases.actions; 