import api from "./axios";


export const registerApiRequest = async (body) => {
  const response = await api.post(
    "accounts/register/",
    body
  )

  return response.data;
} 

export const tokenApiRequest = async (credentials) => {
  const response = await api.post(
    "token/",
    credentials
  )

  return response.data;
}

export const userApiRequest = async (access) => {
  const response = await api.get(
    "accounts/profile/",
    {
      headers: {
        Authorization: `Bearer ${access}`
      }
    }
  )

  return response.data;
}

export const refreshTokenApiRequest = async (refresh) => {
  const response = await api.post(
    "token/refresh/",
    {
      refresh
    }
  )

  return response.data;
}