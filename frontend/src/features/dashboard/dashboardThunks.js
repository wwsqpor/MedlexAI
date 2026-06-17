import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchDashboardApiRequest } from "./api/dashboardApi";


export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",

  async (_, thunkApi) => {
    try {

      const fetchDashboardApiResponseData = await fetchDashboardApiRequest()
      return fetchDashboardApiResponseData;

    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data ?? "Fetch dashboard error"
      )
    }
  }
)