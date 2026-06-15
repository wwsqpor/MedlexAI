import { useProfile }from "../../features/profile/hooks"
import styles from "./Header.module.css"


export default function Header() {

  const { user } = useProfile();

  return (
    <header className={styles.header}>
      <div className={styles["profile-preview"]}>
        {/* <img src="" alt=" " /> */}
        <div className={styles["profile-preview__img"]}></div>
        <div className={styles["profile-preview__details"]}>
          <p className={styles["profile-preview__details-fullname"]}>{user?.name} {user?.surname && `${user?.surname[0]}.`}</p>
          <span className={styles["profile-preview__details-role"]}>Студент</span>
        </div>
      </div>
    </header>
  )
}