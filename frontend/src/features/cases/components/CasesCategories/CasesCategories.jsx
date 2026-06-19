import Dropdown from "../../../../components/Dropdown/Dropdown"
import Box from "../../../../components/Box/Box"
import Button from "../../../../components/Button/Button"

import styles from "./CasesCategories.module.css"


export default function CasesCategories({
  categoriesList=[],
  activeCategoryId,
  onCategoryChange
}) {


  // return (
  //   <Box className={styles["cases-categories"]}>
  //     <h5>
  //       Категории
  //     </h5>
  //     <Button
  //       className={`
  //           ${styles["cases-categories__btn"]} 
  //           ${activeCategoryId === "" ? styles["active"] : ""}
  //         `}
  //         onClick={() => onCategoryChange("")}
  //     >
  //       Все
  //     </Button>
  //     {categoriesList.map((category) => (
  //       <Button 
  //         className={`
  //           ${styles["cases-categories__btn"]} 
  //           ${String(category.id) === activeCategoryId ? styles["active"] : ""}
  //         `}
  //         key={category.id} 
  //         onClick={() => onCategoryChange(category.id)}
  //       >
  //         <span>{ category.name }</span>
  //         <span>0</span>
  //       </Button>
  //     ))}
  //   </Box>
  // )

  return (
    <Dropdown 
      className={styles["cases-categories"]}
      trigger={
        <h5>
          Категории
        </h5>
      }
    >
      <Button
        className={`
            ${styles["cases-categories__btn"]} 
            ${activeCategoryId === "" ? styles["active"] : ""}
          `}
          onClick={() => onCategoryChange("")}
      >
        Все
      </Button>
      {categoriesList.map((category) => (
        <Button 
          className={`
            ${styles["cases-categories__btn"]} 
            ${String(category.id) === activeCategoryId ? styles["active"] : ""}
          `}
          key={category.id} 
          onClick={() => onCategoryChange(category.id)}
        >
          <span>{ category.name }</span>
          <span>0</span>
        </Button>
      ))}
    </Dropdown>
  )
}