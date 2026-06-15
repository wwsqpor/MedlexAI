import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProfile,
  updateProfile
} from "./profileThunks.js"


const initialState = {
  user: null,
  stats: null,
  isLoading: false,
  error: ""
}

const profileSlice = createSlice({
  name: "profile",
  initialState,

  reducers: {
    clearProfile(state) {
      state.user = null;
      state.stats = null;
      state.isLoading = false;
      state.error = ""
    },
    clearError(state) {
      state.error = false;
    }
  },
  extraReducers: (builder) => {
    builder

    .addCase(fetchProfile.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    })
    .addCase(fetchProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(fetchProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = "";
      state.user = action.payload;
    })
    .addCase(updateProfile.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    })
    .addCase(updateProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    })
  }
})


export default profileSlice.reducer;