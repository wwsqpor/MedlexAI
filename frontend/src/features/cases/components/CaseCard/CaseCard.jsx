
import Tag from "../Tag/Tag"
import Box from "../../../../components/Box/Box"

import styles from "./CaseCard.module.css"


export default function CaseCard({
  caseData,
  ...props
}) {

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

  return (
    <Box 
      className={styles["case-card"]}
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