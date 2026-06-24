import { useAppSelector, useAppDispatch } from "../../../app/hooks"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

import { 
  // selectResult,
  selectResultStatus,
} from "../userCasesSelectors"
import {
  completeCase
} from "../userCasesThunks"

export default function useCompleteCase() {

  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const result = useAppSelector(selectResult);
  const resultStatus = useAppSelector(selectResultStatus);

  const complete = async () => {
    navigate(`/cases/sessions/${sessionId}/result`)
    await dispatch(completeCase(Number(sessionId))).unwrap()
  }

  return {
    complete,
    resultStatus
  }

}