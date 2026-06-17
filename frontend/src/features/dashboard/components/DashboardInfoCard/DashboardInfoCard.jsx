import Box from "../../../../components/Box/Box"
import styles from "./DashboardInfoCard.module.css"


export default function DashboardInfoCard({ 
  Icon, 
  title, 
  value, 
  trend,
  color,
  trendColor,
}) {

  const colorClasses = {
    purple: {
      icon: styles.purple,
      bg: styles["purple-bg"]
    },
    success: {
      icon: styles.success,
      bg: styles["success-bg"]
    },
    warning: {
      icon: styles.warning,
      bg: styles["warning-bg"]
    },
    blue: {
      icon: styles.blue,
      bg: styles["blue-bg"]
    },
    yellow: {
      icon: styles.yellow,
      bg: styles["yellow-bg"]
    }
  }

  return (
    <Box className={styles["info-card"]}>
      <div className={`${styles["info-card__icon-container"]} ${colorClasses[color].bg}`}>
        <Icon className={`${styles.icon} ${colorClasses[color].icon}`}/>
      </div>
      <div className={styles["info-card__data-container"]}>
        <h4 className={`${styles.title}`}>{ title }</h4>
        <p className={`${String(value).length > 4 ? styles["value-long"] : styles.value}`}> { value }</p>
        <span className={styles[trendColor]}>{ trend }</span>
      </div>
    </Box>
  )
}