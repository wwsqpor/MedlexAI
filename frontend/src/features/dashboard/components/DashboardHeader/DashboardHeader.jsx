import styles from "./DashboardHeader.module.css"
import { useProfile } from "../../../profile/hooks"


export default function DashboardHeader({ className }) {

  const { user } = useProfile()

  return (
    <header className={`${styles["dashboard-header"]} ${className ?? ""}`}>
      <h3 className={styles.title}>
        { user.name 
        ? `Добро пожаловать, ${user.name}!`  
        : `Добро пожаловать!`
        }
      </h3>
      <p className={styles.text}>Продожайте обучение и повышайте свою юридическую грамотность</p>
    </header>
  )
}