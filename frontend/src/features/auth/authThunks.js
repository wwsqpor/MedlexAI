import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { 
  registerApiRequest, 
  tokenApiRequest, 
  userApiRequest, 
  refreshTokenApiRequest,
  googleLoginApiRequest,
} from "../../api/authApi";
import { fetchProfile } from "../profile/profileThunks";
import { setAccessToken } from "./authSlice";


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
      thunkApi.dispatch(setAccessToken(access))
      await thunkApi.dispatch(fetchProfile()).unwrap()

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
  "auth/initializeAuth",

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
      thunkApi.dispatch(setAccessToken(access));

      // const userApiResponseData = await userApiRequest(access);

      await thunkApi.dispatch(fetchProfile()).unwrap()

      return {
        accessToken: access,
        // user: userApiResponseData
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
        error.response?.data || error.message || "Unknown error"
      )
    }
  }
)

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",

  async ({ credential, rememberMe}, thunkApi) => {
    try {
      const googleLoginApiResponseData = await googleLoginApiRequest(credential);
      const { access, refresh } = googleLoginApiResponseData;

      if (rememberMe) {
        localStorage.setItem("refresh", refresh);
      } else {
        sessionStorage.setItem("refresh", refresh);
      }
      thunkApi.dispatch(setAccessToken(access));
      await thunkApi.dispatch(fetchProfile()).unwrap()

      return {
        accessToken: access,
        user: googleLoginApiResponseData.user
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