import { useCasesFilters } from "../../hooks"

import CasesCategories from "../CasesCategories/CasesCategories"
import CasesFilters from "../CasesFilters/CasesFilters"
import CasesSearch from "../CasesSearch/CasesSearch"
import CasesSort from "../CasesSort/CasesSort"

import styles from "./CasesLibrary.module.css"


export default function CasesLibrary() {

  const {
    search,
    order,
    category,
    difficulty,
    setFilter,
    clearFilters
  } = useCasesFilters()

  return (
    <div className={styles["cases-library"]}>
      <div className={styles["cases-library__filters"]}>
        <CasesCategories 
          className={styles["categories-filter"]}
          // categories={}
        />
        <CasesFilters 
          difficulty={difficulty}
          onDifficultyChange={(value) => setFilter("difficulty", value)}
        />
      </div>
      
      <div className={styles["cases-library__cases"]}>
        <div className={styles["cases-library__cases-top"]}>
          <CasesSearch 
            value={search}
            onChange={(value) => setFilter("search", value)}
            />
          <CasesSort 
            value={order}
            onChange={(value) => setFilter("order", value)}
            />
        </div>
      </div>
    </div>
  )
}