import { 
  selectProfileUser,
  selectProfileStats,
  selectProfileUserStatus,
  selectProfileError
 } from "../profileSelectors.js"
import { useAppSelector } from "../../../app/hooks"

export default function useProfile() {

  const user = useAppSelector(selectProfileUser);
  const stats = useAppSelector(selectProfileStats);
  const userStatus = useAppSelector(selectProfileUserStatus);
  const error = useAppSelector(selectProfileError);

  return {
    user,
    stats,
    userStatus,
    error
  }

 }