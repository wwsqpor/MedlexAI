import api from "../../../api/axios";


export const askAiApiRequest = async (message) => {
  const response = await api.post(
    "ai-tutor/",
    {
      message
    }
  )
  // console.log(response)
  return response.data;
}