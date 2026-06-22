import { useUserCaseSessions } from "../../hooks"

import HistoryCard from "../HistoryCard/HistoryCard"
import styles from "./HistoryList.module.css"


export default function HistoryList() {

  const { userCaseSessions, isLoading } = useUserCaseSessions()

  if (isLoading) {
    return <h2>Loading</h2>
  }


  // console.log(userCaseSessions)

  return (
    <div className={styles["history-list"]}>
      {userCaseSessions.length > 0 && 
        userCaseSessions.map((item) => (
          <HistoryCard caseData={item} key={item.id}/>
        ))
      }
    </div>
  )
}