import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProfile,
  updateProfile
} from "./profileThunks.js"


const initialState = {
  user: null,
  userStatus: "idle",

  stats: null,
  error: ""
}

const profileSlice = createSlice({
  name: "profile",
  initialState,

  reducers: {
    clearProfile(state) {
      state.user = null;
      state.stats = null;
      state.userStatus = "idle";
      state.error = ""
    },
    clearError(state) {
      state.error = false;
    }
  },
  extraReducers: (builder) => {
    builder

    .addCase(fetchProfile.pending, (state) => {
      state.userStatus = "loading";
      state.error = "";
    })
    .addCase(fetchProfile.rejected, (state, action) => {
      state.userStatus = "failed";
      state.error = action.payload;
    })
    .addCase(fetchProfile.fulfilled, (state, action) => {
      state.userStatus = "succeeded";
      state.user = action.payload;
      state.error = "";
    })
    .addCase(updateProfile.pending, (state) => {
      state.userStatus = "loading";
      state.error = "";
    })
    .addCase(updateProfile.rejected, (state, action) => {
      state.userStatus = "failed";
      state.error = action.payload;
    })
    .addCase(updateProfile.fulfilled, (state, action) => {
      state.userStatus = "succeeded";
      state.user = action.payload;
    })
  }
})


export default profileSlice.reducer;