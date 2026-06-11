import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { registerApiRequest, tokenApiRequest, userApiRequest, refreshTokenApiRequest } from "../../api/authApi";


export const register = createAsyncThunk(
  "auth/register",

  async (body, thunkApi) => {
    try {
      return await registerApiRequest(body);
    } catch (error) {
      if (axios.isAxiosError(error)) {

        if (error.response) {
         console.error("Status: ", error.response.status);
         console.error("Data: ", error.response.data);
        }
        else if (error.request) {
          console.error("No response: ", error.request);
        }
        else {
          console.error("Unknow error: ", error.message);
        }
      } else {
        console.error("Non-axios error: ", error);
      }
      return thunkApi.rejectWithValue(
        error.response.data || "Unknown error"
      )
    }
  }
)

export const login = createAsyncThunk(
  "auth/login",

  async ({ credentials, rememberMe}, thunkApi) => {
    try {
      const tokenApiResponseData = await tokenApiRequest(credentials);
      const { access, refresh } = tokenApiResponseData;

      if (rememberMe) {
        localStorage.setItem("refresh", refresh);
      } else {
        sessionStorage.setItem("refresh", refresh);
      }

      const userApiResponseData = await userApiRequest(access);

      return {
        accessToken: access,
        user: userApiResponseData
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {

        if (error.response) {
         console.error("Status: ", error.response.status);
         console.error("Data: ", error.response.data);
        }
        else if (error.request) {
          console.error("No response: ", error.request);
        }
        else {
          console.error("Unknow error: ", error.message);
        }
      } else {
        console.error("Non-axios error: ", error);
      }
      return thunkApi.rejectWithValue(
        "Login failed"
      )
    }
  }  
)

export const logout = createAsyncThunk(
  "auth/logout",
  
  async () => {
    localStorage.removeItem("refresh");
    sessionStorage.removeItem("refresh");
  }
)

export const initializeAuth = createAsyncThunk(
  "auth/initialize",

  async (_, thunkApi) => {
    try {
      const refresh = localStorage.getItem("refresh") || sessionStorage.getItem("refresh");

      
      if (!refresh) {
        return thunkApi.rejectWithValue("No refresh token");
      }
      
      const storage =
        localStorage.getItem("refresh")
          ? localStorage
          : sessionStorage;
      
      const refreshApiResponseData = await refreshTokenApiRequest(refresh);
      const { access, refresh: newRefresh } = refreshApiResponseData;
      storage.setItem("refresh", newRefresh);

      const userApiResponseData = await userApiRequest(access);

      return {
        accessToken: access,
        user: userApiResponseData
      }

    } catch (error) {
      localStorage.removeItem("refresh");

      if (axios.isAxiosError(error)) {

        if (error.response) {
         console.error("Status: ", error.response.status);
         console.error("Data: ", error.response.data);
        }
        else if (error.request) {
          console.error("No response: ", error.request);
        }
        else {
          console.error("Unknow error: ", error.message);
        }
      } else {
        console.error("Non-axios error: ", error);
      }
      return thunkApi.rejectWithValue(
        `Refresh token obtain failed: ${error.response.data || "unknown error"}`
      )
    }
  }
)