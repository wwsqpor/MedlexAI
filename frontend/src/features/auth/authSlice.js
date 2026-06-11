import { createSlice } from "@reduxjs/toolkit";

import { register, login, logout, initializeAuth } from "./authThunks";


const initialState = {
  user: null,
  accessToken: "",
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  error: ""
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = ""
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    })
    .addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase(register.fulfilled, (state) => {
      state.isLoading = false;
    })
    .addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    })
    .addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isInitialized = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isInitialized = true;
    })
    .addCase(logout.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    })
    .addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = "";
    })
    .addCase(initializeAuth.pending, (state) => {
      state.isLoading = true;
      state.error = "";
    })
    .addCase(initializeAuth.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isInitialized = true;
    })
    .addCase(initializeAuth.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    })
  }
})


export default authSlice.reducer;