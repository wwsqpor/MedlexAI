import { useUserCaseSessions } from "../../hooks"

import HistoryCard from "../HistoryCard/HistoryCard"
import Loader from "../../../../components/Loader/Loader"

import styles from "./HistoryList.module.css"


export default function HistoryList() {

  const { userCaseSessions, isLoading } = useUserCaseSessions()

  if (isLoading) {
    return <Loader />
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