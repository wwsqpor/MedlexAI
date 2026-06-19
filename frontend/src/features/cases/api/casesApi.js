import api from "../../../api/axios"


export const fetchCasesApiRequest = async () => {
  const response = await api.get(
    "cases/cases/"
  )
  return response.data;
}
export const fetchCaseDetailsApiRequest = async (caseId) => {
  const response = await api.get(
    `cases/cases/${caseId}/`
  )
  return response;
}

export const fetchCategoriesApiRequest = async () => {
  const response = await api.get(
    "cases/categories/"
  )
  return response.data;
}

