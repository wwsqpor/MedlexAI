import { useProfile } from "../../features/profile/hooks"
import EditProfileForm from "../../features/profile/components/EditProfileForm/EditProfileForm"
import EditProfileHeader from "../../features/profile/components/EditProfileHeader/EditProfileHeader"
import styles from "./EditProfilePage.module.css"


export default function EditProfilePage() {

  const { user } = useProfile()

  return (
    <div className={styles["edit-profile-page"]}>
      <EditProfileHeader />
      <EditProfileForm />
      {/* <h3>{JSON.stringify(user)}</h3> */}
    </div>
  )
}