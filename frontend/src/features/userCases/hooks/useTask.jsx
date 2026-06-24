import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectCurrentSession,
  selectCurrentSessionStatus,
  selectSubmitAnswerStatus,
  selectTaskAnswer,
  selectUserAnswers,
} from "../userCasesSelectors"
import { fetchUserCaseSessionDetails, submitAnswer } from "../userCasesThunks";
import { addAnswer } from "../userCasesSlice"

export default function useTask() {

  const { sessionId, taskId } = useParams();

  const dispatch = useAppDispatch();
  const currentSession = useAppSelector(selectCurrentSession);
  const submitAnswerStatus = useAppSelector(selectSubmitAnswerStatus);
  const currentTask = currentSession.tasks[Number(taskId) - 1];
  const currentTaskAnswer = useAppSelector(state => selectTaskAnswer(state, currentTask.id))
  const preSubmittedUserAnswers = useAppSelector(selectUserAnswers);


  const submitTaskAnswer = async (payload) => {
    // console.log("Payload: ", payload)
    await dispatch(
      submitAnswer({
        sessionId: Number(sessionId),
        taskId: currentTask.id,
        ...payload
      })
    ).unwrap()
    dispatch(fetchUserCaseSessionDetails(Number(sessionId)));
  }

  const saveAnswer = (payload) => {
    dispatch(addAnswer({
      attempt_id: Number(sessionId),
      task_id: currentTask.id,
      ...payload
    }))
  }

  return {
    sessionId: Number(sessionId),
    taskId,
    currentTask,
    submitTaskAnswer,
    submitAnswerStatus,
    currentTaskAnswer,
    saveAnswer,
    preSubmittedUserAnswers,
  }

}