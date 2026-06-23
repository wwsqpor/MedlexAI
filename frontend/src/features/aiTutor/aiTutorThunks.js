import { createAsyncThunk } from "@reduxjs/toolkit"

import {
  askAiApiRequest
} from "./api/aiTutor"


export const askAi = createAsyncThunk(
  "aiTutor/askAi",
  async (message, thunkApi) => {
    try {
      const response = await askAiApiRequest(message);
      console.log(response)
      return {
        role: "AI",
        content: response.answer
      };

    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message ?? "Failed to ask"
      )
    }

  }
)