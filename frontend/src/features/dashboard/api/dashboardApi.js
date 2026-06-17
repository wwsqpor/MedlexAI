import api from "../../../api/axios";


export const fetchDashboardApiRequest = async () => {
  const response = await api.get(
    "dashboard"
  )

  return response.data;
}