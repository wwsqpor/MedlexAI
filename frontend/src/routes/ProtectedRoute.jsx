import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";


export default function ProtectedRoute() {

  const { isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) {
    return <div>loading</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>
  }

  return <Outlet />

}