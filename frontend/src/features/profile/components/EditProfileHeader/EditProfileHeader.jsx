import styles from "./EditProfileHeader.module.css"


export default function EditProfileHeader() {

  return (
    <header>
      <h3 className={styles.title}>Редактировать профиль</h3>
      <p className={styles.text}>Настройте свой профиль, обновите информацию и персонализируйте аккаунт</p>
    </header>
  )
}