import { createSlice } from "@reduxjs/toolkit";

import { fetchCases } from "./casesThunks";

const initialState = {
  cases: [],
  selectedCase: null,

  isLoading: false,
  error: ""
}


const casesSlice = createSlice({
  name: "cases",
  initialState,

  reducers: {
    selectCase(state, action) {
      state.selectedCase = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCases.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cases = action.payload;
      })
  }
})

export const { selectCase } = casesSlice.actions;

export default casesSlice.reducer;
