import styles from "./ProfileHeader.module.css"


export default function ProfileHeader() {

  return (
    <header>
      <h3 className={styles.title}>Профиль</h3>
      <p className={styles.text}>Управляйте своими данными, отслеживайте прогресс и достижения</p>
    </header>
  )
}