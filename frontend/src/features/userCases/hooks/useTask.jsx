import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectCurrentSession,
  selectCurrentSessionStatus,
  selectSubmitAnswerStatus,
  selectTaskAnswer
} from "../userCasesSelectors"
import { submitAnswer } from "../userCasesThunks";
 

export default function useTask() {

  const { sessionId, taskId } = useParams();

  const dispatch = useAppDispatch();
  const currentSession = useAppSelector(selectCurrentSession);
  const submitAnswerStatus = useAppSelector(selectSubmitAnswerStatus);
  const currentTask = currentSession.tasks[Number(taskId) - 1];
  const currentTaskAnswer = useAppSelector(state => selectTaskAnswer(state, currentTask.id))


  const submitTaskAnswer = (payload) => {
    console.log("Payload: ", payload)
    dispatch(
      submitAnswer({
        sessionId: Number(sessionId),
        taskId: currentTask.id,
        ...payload
      })
    ).unwrap()
  }

  return {
    sessionId,
    currentTask,
    submitTaskAnswer,
    submitAnswerStatus,
    currentTaskAnswer
  }

}