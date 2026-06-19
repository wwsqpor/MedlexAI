import Box from "../../../../components/Box/Box"
import Button from "../../../../components/Button/Button"

import styles from "./CasesCategories.module.css"


export default function CasesCategories() {


  const categoriesList = ["Все кейсы"]


  return (
    <Box className={styles["cases-categories"]}>
      <h5>
        Категории
      </h5>
      {categoriesList.map((value) => (
        <Button key={value} className={`${styles["cases-categories__btn"]} ${styles["active"]}`}>
          <span>{ value }</span>
          <span>0</span>
        </Button>
      ))}
    </Box>
  )
}