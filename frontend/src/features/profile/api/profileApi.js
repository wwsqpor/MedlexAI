import api from "../../../api/axios";


export const fetchProfileApiRequest = async () => {
  const response = await api.get(
    "accounts/profile/"
  )

  return response.data;
}

export const updateProfileApiRequest = async (data) => {
  const response = await api.patch(
    "accounts/profile/update/",
    data
  )

  return response.data;
}