import PageNav from "../../../../components/PageNav/PageNav"

import styles from "./CasesHeader.module.css"


const navList = [
  {
    label: "Библиотека кейсов",
    path: "/cases",
    end: true
  },
  {
    label: "История кейсов",
    path: "/cases/history",
    end: true
  }
] 

export default function CasesHeader() {

  return (
    <header className={styles["header"]}>
      <h3>
        Работа с кейсами
      </h3>
      <PageNav navList={navList}/>
    </header>
  )
}