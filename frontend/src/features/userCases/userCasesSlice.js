import { createSlice } from "@reduxjs/toolkit";

import { fetchUserCaseSessions } from "./userCasesThunks";


const initialState = {
  userCaseSessions: [],
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
  }
})


export default userCases.reducer;