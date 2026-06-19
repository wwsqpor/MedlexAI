import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchMyCasesApiRequest
} from "./api/userCasesApi"


export const fetchMyCases = createAsyncThunk(
  "cases/fetchMyCases",

  async (_, thunkApi) => {
    try {
      const fetchMyCasesApiResponseData = await fetchMyCasesApiRequest();
      
      return fetchMyCasesApiResponseData;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch my cases"
      )
    }
  }
)