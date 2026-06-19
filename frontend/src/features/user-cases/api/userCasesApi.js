import api from "../../../api/axios";


export const fetchMyCasesApiRequest = async () => {
  const response = await api.get(
    "cases/attemps/"
  )
  return response.data;
}
 