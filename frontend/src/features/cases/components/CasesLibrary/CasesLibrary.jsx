
import { useCasesLibrary, useCasesFilters } from "../../hooks"

import Box from "../../../../components/Box/Box"
import CasesCategories from "../CasesCategories/CasesCategories"
import CasesFilters from "../CasesFilters/CasesFilters"
import CasesSearch from "../CasesSearch/CasesSearch"
import CasesSort from "../CasesSort/CasesSort"
import CasesList from "../CasesList/CasesList"
import CaseDrawer from "../CaseDrawer/CaseDrawer"
import Loader from "../../../../components/Loader/Loader"

import styles from "./CasesLibrary.module.css"


export default function CasesLibrary() {

  const {
    cases,
    categories,
    casesStatus,
    categoriesStatus,
  } = useCasesLibrary();

  const {
    search,
    order,
    category,
    difficulty,
    setFilter,
  } = useCasesFilters()

  if (casesStatus === "loading" || categoriesStatus === "loading") {
    return <Loader />
  }

  return (
    <div className={styles["cases-library"]}>
      <div className={styles["cases-library__filters"]}>
        <CasesCategories 
          className={styles["categories-filter"]}
          categoriesList={categories}
          activeCategoryId={category}
          onCategoryChange={(value) => setFilter("category", value)}
        />
        <CasesFilters 
          difficulty={difficulty}
          onDifficultyChange={(value) => setFilter("difficulty", value)}
        />
      </div>
      
      <div className={styles["cases-library__cases"]}>
        <Box className={styles["cases-library__cases-top"]}>
          <CasesSearch 
            value={search}
            onChange={(value) => setFilter("search", value)}
            />
          <CasesSort 
            value={order}
            onChange={(value) => setFilter("order", value)}
            />
        </Box>
        <CasesList casesList={cases}/>
      </div>
      <CaseDrawer className={styles["cases-library__panel"]}/>
    </div>
  )
}