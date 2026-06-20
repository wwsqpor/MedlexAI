import { useEffect } from "react";

import { useAppSelector, useAppDispatch } from "../../../app/hooks"

import {
  fetchUserCaseSessions
} from "../userCasesThunks"

import {
  selectUserCaseSessions,
  selectStatus,
  selectError
} from "../userCasesSelectors"


export default function useUserCaseSessions() {

  const dispatch = useAppDispatch()

  const userCaseSessions = useAppSelector(selectUserCaseSessions);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError)

  useEffect(() => {

    if (status === "idle") {
      dispatch(fetchUserCaseSessions())
    }
  }, [])

  return {
    userCaseSessions,
    status,
    isLoading: status === "loading",
    error
  }

}