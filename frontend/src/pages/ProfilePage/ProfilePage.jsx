import { useAuth } from "../../features/auth/useAuth"
import "./ProfilePage.css"  


export default function ProfilePage() {

  const { user } = useAuth();

  return (
    <h1>{ JSON.stringify(user) }</h1>
  )
}