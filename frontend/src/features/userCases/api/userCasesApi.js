import api from "../../../api/axios";


export const fetchUserCaseSessionsApiRequest = async () => {
  const response = await api.get(
    "cases/attempts/"
  )
  return response.data;
}
 