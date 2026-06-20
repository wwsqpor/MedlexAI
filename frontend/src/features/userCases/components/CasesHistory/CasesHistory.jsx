import HistoryList from "../HistoryList/HistoryList"

import styles from "./CasesHistory.module.css"


export default function CasesHistory() {

  return (
    <div className={styles["cases-history"]}>
      <HistoryList />
    </div>
  )
}