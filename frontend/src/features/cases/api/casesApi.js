import api from "../../../api/axios"


export const fetchCasesApiRequest = async () => {

  const response = await api.get(
    "cases/cases/"
  )

  return response.data;
}