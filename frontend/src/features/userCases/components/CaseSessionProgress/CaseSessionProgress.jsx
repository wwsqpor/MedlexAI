import { Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom"

import styles from "./CaseSessionProgress.module.css"


export default function CaseSessionProgress() {

  const { sessionId, taskId } = useParams();
  const currentIndex = Number(taskId) - 1;

  const navigate = useNavigate();

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
          onClick={() => navigate(`/cases/sessions/${sessionId}/tasks/${value}`)}
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