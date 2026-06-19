
import styles from "./Tag.module.css";


const colorClasses = {
   purple: styles.purple,
   success: styles.success,
   warning: styles.warning,
   blue: styles.blue,
   yellow: styles.yellow,
 }

export default function Tag({
  color,
  children
}) {
  

  return (
    <span className={`${styles.tag} ${colorClasses[color]}`}>{ children }</span>
  )
}