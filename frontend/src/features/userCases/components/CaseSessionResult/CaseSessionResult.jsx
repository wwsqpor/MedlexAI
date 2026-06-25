import { useCaseResult, useCurrentUserCaseSession } from "../../hooks"

import Box from "../../../../components/Box/Box"
import Loader from "../../../../components/Loader/Loader"

import styles from "./CaseSessionResult.module.css"
import { Navigate } from "react-router-dom";


export default function CaseSessionResult() {

  const { result, resultStatus } = useCaseResult();
  const { currentSession } = useCurrentUserCaseSession();

  if (resultStatus === "loading") {
    return <Loader />
  }

  if (result.status === "in_progress") {
    return <Navigate to={`/cases`}/>
  }

  const started = new Date(currentSession.started_at);
  const completed = new Date(currentSession.completed_at);

  const durationMinutes = Math.floor(
    (completed - started) / 1000 / 60
  );

  const completedAt = completed.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className={styles["case-session-result"]}>
      <h2>Результаты</h2>
      <h4>{ result.case }</h4>
      <div className={styles.stats}>
      <Box className={styles.card}>
        <span className={styles.label}>Балл</span>
        <span className={styles.value}>{result.total_score} / 100</span>
      </Box>

      <Box className={styles.card}>
        <span className={styles.label}>Статус</span>
        <span className={styles.value}>Завершено</span>
      </Box>

      <Box className={styles.card}>
        <span className={styles.label}>Время</span>
        <span className={styles.value}>{ durationMinutes } мин.</span>
      </Box>
      <Box className={styles.card}>
        <span className={styles.label}>Дата</span>
        <span className={styles.value}>{ completedAt }</span>
      </Box>
    </div>
      {/* <p>{ JSON.stringify(result) }</p> */}
    </div>
  )
}