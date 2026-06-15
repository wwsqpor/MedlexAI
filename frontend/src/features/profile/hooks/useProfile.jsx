import { 
  selectProfileUser,
  selectProfileStats,
  selectProfileIsLoading,
  selectProfileError
 } from "../profileSelectors.js"
import { useAppSelector } from "../../../app/hooks"

export default function useProfile() {

  const user = useAppSelector(selectProfileUser);
  const stats = useAppSelector(selectProfileStats);
  const isLoading = useAppSelector(selectProfileIsLoading);
  const error = useAppSelector(selectProfileError);

  return {
    user,
    stats,
    isLoading,
    error
  }

 }