import { useEffect } from "react";
import { useParams } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { 
  selectCurrentSession, 
  selectCurrentSessionStatus 
} from "../userCasesSelectors";
import {
  fetchUserCaseSessionDetails
} from "../userCasesThunks"


export default function useCurrentUserCaseSession() {

  const { sessionId } = useParams();

  const dispatch = useAppDispatch();

  const currentSession = useAppSelector(selectCurrentSession);
  const currentSessionStatus = useAppSelector(selectCurrentSessionStatus);

  useEffect(() => {
    if (currentSessionStatus === "succeeded" && currentSession.id === Number(sessionId)) {
      return;
    }

    dispatch(fetchUserCaseSessionDetails(sessionId));

  }, [sessionId, dispatch])

  return {
    currentSession,
    currentSessionStatus
  }

}