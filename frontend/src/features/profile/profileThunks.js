import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchProfileApiRequest,
  updateProfileApiRequest
} from "./api/profileApi.js"


export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  
  async (_, thunkApi) => {
    try {
      const fetchProfileResponseData = await fetchProfileApiRequest();
      return fetchProfileResponseData;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data ?? "Failed to load profile"
      )
    }
  }
)

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",

  async (data, thunkApi) => {
    try {
      const updateProfileResponseData = await updateProfileApiRequest(data);

      return updateProfileResponseData;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data ?? "Failed to update profile"
      )
    }
  }
)