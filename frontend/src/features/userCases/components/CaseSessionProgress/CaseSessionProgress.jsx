import { Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom"

import { useCaseResult } from "../../hooks"

import styles from "./CaseSessionProgress.module.css"


export default function CaseSessionProgress() {

  const { sessionId, taskId } = useParams();
  const { result } = useCaseResult();
  const isResultPage = taskId === undefined;
  const currentIndex = isResultPage ? 4 : Number(taskId) - 1;

  const navigate = useNavigate();
  const handleClick = (value) => {
    if (value === 4) {
      if (result.status === "in_progress") {
        return;
      }
      navigate(`/cases/sessions/${sessionId}/result`);
      return;
    }
    navigate(`/cases/sessions/${sessionId}/tasks/${value}`);
  }

  return (
    <div className={styles["progress"]}>
     {[1, 2, 3, 4].map((value, index) => (
      <Fragment key={value}>
        <div 
          className={`
            ${styles["progress-stage"]}
            ${index <= currentIndex 
              ? styles["stage-fill"] 
              : ""
            }
          `}
          onClick={() => handleClick(value)}
        >
          { value }
        </div>
        {value !== 4 && 
          <div className={styles["progress-bar"]}>
            <div className={
              index < currentIndex 
              ? styles["fill"]
              : index === currentIndex 
              ? styles["half-fill"]
              : ""
            }/>
          </div>
        }
      </Fragment>))
      }
    </div>
  )
}