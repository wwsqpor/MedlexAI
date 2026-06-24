import { useEffect } from "react"

import { useAppSelector, useAppDispatch } from "../../../app/hooks"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"

import { 
  selectResult,
  selectResultStatus,
} from "../userCasesSelectors"
import {
  fetchUserCaseSessionResult
} from "../userCasesThunks"

export default function useCaseResult() {

  const { sessionId } = useParams();
  // const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const result = useAppSelector(selectResult);
  const resultStatus = useAppSelector(selectResultStatus);

  useEffect(() => {
    if (resultStatus === "idle") {
      dispatch(
        fetchUserCaseSessionResult(Number(sessionId))
      );
    }


  }, [dispatch, sessionId])

  return {
    result,
    resultStatus
  }

}