import { createAsyncThunk } from "@reduxjs/toolkit"

import {
  askAiApiRequest,
  fetchChatHistoryApiRequest
} from "./api/aiTutor"


export const askAi = createAsyncThunk(
  "aiTutor/askAi",
  async (message, thunkApi) => {
    try {
      const response = await askAiApiRequest(message);
      return {
        role: "assistant",
        content: response.answer,
        created_at: new Date().toISOString()
      };

    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message ?? "Failed to ask"
      )
    }

  }
)

export const fetchChatHistory = createAsyncThunk(
  "aiTutor/fetchChatHistory",
  async (message, thunkApi) => {
    try {
      const response = await fetchChatHistoryApiRequest(message);
      return [
        ...response.messages
      ];

    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch chat history"
      )
    }

  }
)