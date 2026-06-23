import api from "../../../api/axios";


export const fetchUserCaseSessionsApiRequest = async () => {
  const response = await api.get(
    "cases/attempts/"
  )
  return response.data;
}
 
export const startUserCaseSessionApiRequest = async (caseId) => {
  const response = await api.post(
    "cases/attempts/start/",
    {
      case_id: caseId
    }
  )

  console.log("Session status: ", response.status);
  return response.data;
}

export const fetchUserCaseSessionDetailsApiRequest = async (sessionId) => {
  const response = await api.get(
    `cases/attempts/${sessionId}/`
  )
  return response.data;
}

export const fetchUserCaseSessionAnswersApiRequest = async (sessionId) => {
  const response = await api.get(
    `cases/attempts/${sessionId}/answers/`
  )
  return response.data;
}

export const fetchCaseTasksApiRequest = async (caseId) => {
  const response = await api.get(
    `cases/cases/${caseId}/tasks/`
  )
  return response.data;
}

export const fetchCaseTaskDetailsApiRequest = async (caseId, taskId) => {
  const response = await api.get(
    `cases/cases/${caseId}/tasks/${taskId}/`
  )
  return response.data;
}

/** 
  * Submit task answer
  * 
  * @param attempt_id User case session id
  * @param task_id Task id
  * @param selected_option_ids Selected options ids (if open question leave blank)
  * @param open_answer Open question answer (if not open question leave blank)
  * 
**/
export const submitTaskAnswerApiRequest = async (
    attemptId, 
    taskId, 
    selectedOptionIds=[], 
    openAnswer=""
  ) => {
    console.log(attemptId, taskId, openAnswer)
    const response = await api.post(
      "cases/submit-answer/",
      {
        attempt_id: attemptId,
        task_id: taskId,
        selected_options: selectedOptionIds,
        open_answer: openAnswer
      }
    )
    return response.data;
}

export const completeUserCaseSession = async (sessionId) => {
  const response = await api.post(
    "cases/complete-case/",
    {
      attempt_id: sessionId
    }
  )
  return response.data;
}