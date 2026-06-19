import { useCasesFilters } from "../../hooks"

import Dropdown from "../../../../components/Dropdown/Dropdown"
import Box from "../../../../components/Box/Box"
import Button from "../../../../components/Button/Button"
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

  const { clearFilters } = useCasesFilters();

  return (
    <Dropdown 
      className={styles["main-filters"]}
      trigger={
        <h5>Фильтры</h5>
      }
    >
      <div className={styles["main-filters__difficulty-filter"]}>
        <p className={styles["difficulty-filter__title"]}>Сложность</p>
        <Select
          className={styles["difficulty-filter__select"]}
          value={difficulty}
          options={difficultyOptions}
          onChange={(e) => onDifficultyChange(e.target.value)}
        />
      </div>
      <Button 
        className={styles["clear-filters-btn"]}
        onClick={() => clearFilters()}
      >
        Сбросить фильтры
      </Button>
    </Dropdown>
  )
}