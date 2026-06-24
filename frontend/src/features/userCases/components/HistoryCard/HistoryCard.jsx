import { useNavigate } from "react-router-dom"

import Tag from "../../../../components/Tag/Tag"
import Box from "../../../../components/Box/Box"

import styles from "./HistoryCard.module.css"


export default function HistoryCard({
  caseData,
  ...props
}) {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/cases/sessions/${caseData.id}/`)
  }

  return (
    <Box 
      className={styles["history-card"]}
      onClick={handleClick}
      {...props}
    >
      <div className={styles["case-card__info"]}>
        <h4 className={styles.title}>
          { caseData.case.title }
        </h4>
        <p>{caseData.case.short_description}</p>
      </div>

      <div className={styles["history-card__result"]}>
        <p className={styles["result-status"]}>
          <span>
            { caseData.status === "completed" ? "Пройден" : "В процессе" }
          </span>
          <span className={styles["result-date"]}>
            {caseData.completed_at 
            ? new Date(caseData.completed_at).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }) 
            : ""}
          </span>
        </p>


        {caseData.status === "completed" && 
          <div className={styles["result-score"]}>
            {/* <span>Результат: </span> */}
            <Tag 
              className={styles["score-tag"]}
              color={
                caseData.total_score > 80 
                ? "success" 
                : caseData.total_score > 40
                ? "yellow" 
                : "warning"
              }
            > 
              {caseData.total_score}%
            </Tag>
          </div>
        }
      </div>
    </Box>
  )

}