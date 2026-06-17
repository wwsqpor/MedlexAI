import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboard } from "./dashboardThunks"


// stats: {
//   // completed_cases,
//   // completed_this_week,
//   // average_score,
//   // score_change,
//   // last_case,
//   // best_result
// }
const initialState = {
  isLoading: false,
  error: "",
  stats: null,
  continue_case: null,
  progress: null,
  strong_topics: null,
  weak_topics: null
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,

  reducers: {

  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchDashboard.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    })
    .addCase(fetchDashboard.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(fetchDashboard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stats = action.payload.stats;
      state.continue_case = action.payload.continue_case;
      state.progress = action.payload.progress;
      state.strong_topics = action.payload.strong_topics;
      state.weak_topics = action.payload.weak_topics;
    })
  }
})


export default dashboardSlice.reducer;