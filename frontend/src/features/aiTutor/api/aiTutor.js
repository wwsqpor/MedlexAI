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

export const fetchChatHistoryApiRequest = async () => {
  const response = await api.get(
    "ai-tutor/history/"
  )
  return response.data;
}