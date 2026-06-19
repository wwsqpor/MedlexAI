import Box from "../../../../components/Box/Box"
import Select from "../../../../components/Select/Select"

import styles from "./CasesFilters.module.css"


const difficultyOptions = [
  {
    value: "",
    label: ""
  },
  {
    value: "easy",
    label: "Легкая"
  },
  {
    value: "medium",
    label: "Средняя"
  },
  {
    value: "hard",
    label: "Сложная"
  },
  
]

export default function CasesFilters({
  difficulty,
  onDifficultyChange
}) {


  return (
    <Box className={styles["main-filters"]}>
      <h5>Фильтры</h5>
      <div className={styles["main-filters__difficulty-filter"]}>
        <p className={styles["difficulty-filter__title"]}>Сложность</p>
        <Select
          className={styles["difficulty-filter__select"]}
          value={difficulty}
          options={difficultyOptions}
          onChange={(e) => onDifficultyChange(e.target.value)}
        />
      </div>
    </Box>
  )
}