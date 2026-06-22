import { useState } from "react";

import Box from "../../../../components/Box/Box"
import Button from "../../../../components/Button/Button"

import styles from "./CaseDescription.module.css"


export default function CaseDescription({
  description
}) {

  const [isOpen, setIsOpen] = useState(true);

  const handleHide = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <Box className={styles.case}>
      <div className={styles["top-row"]}>
        <h4>Ситуация</h4>
        <Button 
          onClick={handleHide}
          className={styles.hide}
        >
          {isOpen ? "Скрыть" : "Показать"}
        </Button>
      </div>

      {isOpen && 
        <div className={styles.description}>
          <h5>Описание</h5>
          <p>{ description ?? "Описания нет" }</p>
        </div>
      }
    </Box>
  )
}