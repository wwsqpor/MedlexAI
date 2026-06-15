import { useAppSelector } from "../../../app/hooks"

import {
  selectUser,
  selectIsAuthenticated,
  selectIsInitialized,
  selectIsLoading,
  selectError
} from "../authSelectors";

/*
* { user, isAuthenticated, isInitialized, isLoading, error }
*/ 
export default function useAuth() {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInitialized = useAppSelector(selectIsInitialized)
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  return {
    user,
    isAuthenticated,
    isInitialized,
    isLoading,
    error
  }
}