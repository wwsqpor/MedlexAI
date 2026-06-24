import { useCaseResult } from "../../hooks"

import Loader from "../../../../components/Loader/Loader"

import styles from "./CaseSessionResult.module.css"


export default function CaseSessionResult() {

  const { result, resultStatus } = useCaseResult();

  if (resultStatus === "loading") {
    return <Loader />
  }

  return (
    <div className={styles["case-session-result"]}>
      <h2>Case session result</h2>
      <p>{ JSON.stringify(result) }</p>
    </div>
  )
}