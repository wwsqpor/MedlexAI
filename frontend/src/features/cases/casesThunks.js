import { createAsyncThunk } from "@reduxjs/toolkit";

import { 
  fetchCasesApiRequest,
  fetchCaseDetailsApiRequest,
  fetchCategoriesApiRequest,
 } from "./api/casesApi";


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

export const fetchCategories = createAsyncThunk(
  "cases/fetchCategories",

  async (_, thunkApi) => {
    try {
      const fetchCategoriesApiResponseData = await fetchCategoriesApiRequest();
      
      return fetchCategoriesApiResponseData;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch categories"
      )
    }
  }
)

