import Box from "../../../../components/Box/Box"

import styles from "./DashboardProgress.module.css"


export default function DashboardProgress({
  progress,
  isLoading
}) {

  return (
    <Box className={styles["progress-container"]}>
      <h4 className={styles["progress-container__title"]}>Ваш прогресс</h4>

      <div className={styles["progress-container__progress"]}>
        <div 
          className={styles["progress-circle"]}
          style={
            {"--value": 67}
          }>
          <div className={styles["progress-inner"]}>
            <span className={styles["progress-inner__rating"]}>{ progress.legal_rating }</span>
            <span className={styles["progress-inner__total"]}>из 100</span>
          </div>
        </div>
        <p className={styles["progress-container__about"]}>Юридический рейтинг</p>
      </div>
    </Box>
  )
}