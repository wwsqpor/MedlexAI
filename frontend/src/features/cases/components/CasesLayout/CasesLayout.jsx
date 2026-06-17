import { Outlet } from "react-router-dom"

import styles from "./CasesLayout.module.css"


export default function CasesLayout() {

  return (
    <div className={styles["cases-page"]}>
      
      <Outlet />
    </div>
  )
}