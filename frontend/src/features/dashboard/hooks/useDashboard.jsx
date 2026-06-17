import { 
  selectStats,
  selectContinueCase,
  selectProgress,
  selectWeakTopics,
  selectStrongTopics,
  selectIsLoading,
  selectError,
 } from "../dashboardSelectors";
import { useAppSelector } from "../../../app/hooks" 


export default function useDashboard() {

  const stats = useAppSelector(selectStats);
  const continueCase = useAppSelector(selectContinueCase);
  const progress = useAppSelector(selectProgress);
  const weakTopics = useAppSelector(selectWeakTopics);
  const strongTopics = useAppSelector(selectStrongTopics);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    stats,
    continueCase,
    progress,
    weakTopics,
    strongTopics,
    isLoading, 
    error,
  }

}