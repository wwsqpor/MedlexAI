import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchCasesApiRequest } from "./api/casesApi";


export const fetchCases = createAsyncThunk(
  "cases/fetchCases",

  async (_, thunkApi) => {
    try {
      const fetchCasesApiResponseData = await fetchCasesApiRequest();
      
      return fetchCasesApiResponseData;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch cases"
      )
    }
  }
)