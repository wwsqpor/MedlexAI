import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchUserCaseSessionsApiRequest,
  startUserCaseSessionApiRequest,
  fetchUserCaseSessionDetailsApiRequest,
  fetchCaseTasksApiRequest,
  submitTaskAnswerApiRequest,
  completeUserCaseSessionApiRequest
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

export const startUserCaseSession = createAsyncThunk(
  "userCases/startUserCaseSession",

  async (caseId, thunkApi) => {
    try {
      const sessionData = await startUserCaseSessionApiRequest(caseId);
      const tasksData = await fetchCaseTasksApiRequest(sessionData.case.id);
      return {
        ...sessionData,
        tasks: tasksData
      };
      
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch user's case session (start)"
      )
    }
  }
)

export const fetchUserCaseSessionDetails = createAsyncThunk(
  "userCases/fetchUserCaseSessionDetails",

  async (sessionId, thunkApi) => {
    try {
      const sessionData = await fetchUserCaseSessionDetailsApiRequest(sessionId);
      const tasksData = await fetchCaseTasksApiRequest(sessionData.case.id);
      return {
        ...sessionData,
        tasks: tasksData
      };
      
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch user's case session details"
      )
    }
  }
)

export const fetchUserCaseSessionTasks = createAsyncThunk(
  "userCases/fetchUserCaseSessionTasks",

  async (caseId, thunkApi) => {
    try {
      const data = await fetchCaseTasksApiRequest(caseId);
      
      return data;
      
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch case tasks"
      )
    }
  }
)

export const submitAnswer = createAsyncThunk(
  "userCases/submitAnswer",

  async ({ sessionId, taskId, selectedOptionsIds, openAnswer }, thunkApi) => {
    try {
      const data = await submitTaskAnswerApiRequest(
        sessionId,
        taskId,
        selectedOptionsIds,
        openAnswer
      );
      
      return data;
      
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch case tasks"
      )
    }
  }
)

export const completeCase = createAsyncThunk(
  "userCases/completeCase",

  async (sessionId, { getState, dispatch, thunkApi }) => {
    try {
      const state = getState();

      const answers = Object.values(
        state.userCases.userAnswers
      )
      
      await Promise.all(
        answers.map(answer => 
          dispatch(
            submitAnswer(
              {
                sessionId,
                taskId: answer["task_id"],
                selectedOptionsIds: answer["selected_option_ids"],
                openAnswer: answer["open_answer"]
              }
            )
          ).unwrap()
        )
      )
      const response = await completeUserCaseSessionApiRequest(sessionId);

      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch case result"
      )
    }
  }
)

export const fetchUserCaseSessionResult = createAsyncThunk(
  "userCases/fetchUserCaseSessionResult",

  async (sessionId, { thunkApi }) => {
    try {
      const response = await completeUserCaseSessionApiRequest(sessionId);

      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error?.response?.data?.message ?? "Failed to fetch case result"
      )
    }
  }
)