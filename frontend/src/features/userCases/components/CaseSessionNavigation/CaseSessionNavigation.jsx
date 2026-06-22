import { useNavigate, useParams } from "react-router-dom"

import Button from "../../../../components/Button/Button"

import styles from "./CaseSessionNavigation.module.css"


export default function CaseSessionNavigation() {

  const navigate = useNavigate();
  const { sessionId, taskId } = useParams();
  const currentTask = Number(taskId);

  const goBack = () => {
    if (currentTask === 1) {
      navigate("/dashboard");
      return;
    }
    navigate(`/cases/sessions/${sessionId}/tasks/${currentTask - 1}`)
  }

  const goNext = () => {
    if (currentTask === 3) {
      return;
    }
    navigate(`/cases/sessions/${sessionId}/tasks/${currentTask + 1}`)
  }

  return (
    <div className={styles["case-session-navigation"]}>
      <Button 
        onClick={goBack}
        className={`${styles.btn} ${styles.back}`}
      >
        {currentTask === 1 ? "Библиотека" : "Вернуться"}
      </Button>
      <Button
        onClick={goNext}
        className={`${styles.btn} ${styles.next}`}

      >
        {currentTask === 3 ? "Завершить" : "Далее"}
      </Button>
    </div>
  )

}