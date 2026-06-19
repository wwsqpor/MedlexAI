import { Outlet } from "react-router-dom"

import CasesHeader from "../CasesHeader/CasesHeader"

import styles from "./CasesLayout.module.css"


export default function CasesLayout() {

  return (
    <div className={styles["cases-page"]}>
      <CasesHeader />
    
      <Outlet />
    </div>
  )
}