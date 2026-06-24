import { useEffect } from "react";

import { 
  selectStats,
  selectContinueCase,
  selectProgress,
  selectWeakTopics,
  selectStrongTopics,
  selectStatus,
  selectError,
 } from "../dashboardSelectors";

import { useAppSelector, useAppDispatch } from "../../../app/hooks" 

import { fetchDashboard } from "../dashboardThunks";


export default function useDashboard() {

  const dispatch = useAppDispatch();

  const stats = useAppSelector(selectStats);
  const continueCase = useAppSelector(selectContinueCase);
  const progress = useAppSelector(selectProgress);
  const weakTopics = useAppSelector(selectWeakTopics);
  const strongTopics = useAppSelector(selectStrongTopics);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  useEffect(() => {
    // console.log(status);
    if (status === "idle") {
      dispatch(fetchDashboard())
    }
  }, [status, dispatch])

  return {
    stats,
    continueCase,
    progress,
    weakTopics,
    strongTopics,
    status,
    isLoading: status === "loading", 
    error,
  }

}