import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks"; 


export default function HomeRedirect() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <div>loading</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>
  }
  return <Navigate to="/profile" replace/>
}