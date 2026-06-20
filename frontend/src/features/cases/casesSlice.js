import { createSlice } from "@reduxjs/toolkit";

import { 
  fetchCases,
  fetchCategories,
  fetchCaseDetails

} from "./casesThunks";

const initialState = {
  cases: [],
  caseDetails: null,

  categories: [],

  casesStatus: "idle",
  categoriesStatus: "idle",
  caseDetailsStatus: "idle",
  error: ""
}


const casesSlice = createSlice({
  name: "cases",
  initialState,

  reducers: {
    setCaseDetails(state, action) {
      state.caseDetails = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCases.pending, (state) => {
        state.casesStatus = "loading";
        state.error = "";
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.casesStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCases.fulfilled, (state, action) => {
        state.casesStatus = "succeeded";
        state.cases = action.payload;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = "loading";
        state.error = "";
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCaseDetails.pending, (state) => {
        state.caseDetailsStatus = "loading";
        state.error = "";
      })
      .addCase(fetchCaseDetails.rejected, (state, action) => {
        state.caseDetailsStatus = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCaseDetails.fulfilled, (state, action) => {
        state.caseDetailsStatus = "succeeded";
        state.caseDetails = action.payload;
      })
  }
})

export const { setcaseDetails } = casesSlice.actions;

export default casesSlice.reducer;
