import { useSelectedCase } from "../../hooks"

import Tag from "../../../../components/Tag/Tag"
import Box from "../../../../components/Box/Box"

import styles from "./CaseCard.module.css"


const difficultyMap = {
  easy: {
    label: "Легкий",
    color: "success"
  },
  medium: {
    label: "Средний",
    color: "yellow"
  },
  hard: {
    label: "Сложный",
    color: "warning"
  }
}

export default function CaseCard({
  caseData,
  ...props
}) {

  const { selectedCaseId, selectCase } = useSelectedCase();

  return (
    <Box 
      onClick={() => selectCase(caseData.id)}
      className={`${styles["case-card"]} ${String(caseData.id) === selectedCaseId ? styles["case-card-selected"] : ""}`}
      {...props}
    >
      <div className={styles["case-card__info"]}>
        <h4 className={styles.title}>{ caseData.title }</h4>
        <p>{ caseData.short_description }</p>
        <div className={styles.tags}>
          <Tag color="purple">{ caseData.category?.name }</Tag>
          <Tag color={difficultyMap[caseData.difficulty].color}>{ difficultyMap[caseData.difficulty].label }</Tag>
        </div>
      </div>

      <div className={styles["case-card__result"]}>

      </div>
    </Box>
  )

}