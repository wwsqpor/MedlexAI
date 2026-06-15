import ProfileHeader from "../../features/profile/components/ProfileHeader/ProfileHeader";
import PersonalInformation from "../../features/profile/components/PersonalInformation/PersonalInformation";

import styles from "./ProfilePage.module.css"  


export default function ProfilePage() {

  return (
    <div className={styles["profile-page"]}>
      <ProfileHeader />
      <PersonalInformation />
    </div>
  )
}