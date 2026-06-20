import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchUserCaseSessionsApiRequest
} from "./api/userCasesApi"


export const fetchUserCaseSessions = createAsyncThunk(
  "userCases/fetchUserCaseSessions",

  async (_, thunkApi) => {
    try {
      const fetchUserCaseSessionsApiResponseData = await fetchUserCaseSessionsApiRequest();
      
      return fetchUserCaseSessionsApiResponseData;
      
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch user's case sessions"
      )
    }
  }
)