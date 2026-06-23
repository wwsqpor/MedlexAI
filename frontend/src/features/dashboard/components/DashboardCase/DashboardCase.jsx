import { useNavigate } from "react-router-dom"

import Box from "../../../../components/Box/Box"
import Button from "../../../../components/Button/Button"

import PlayIcon from "../../../../assets/icons/play.svg?react"
import PlusIcon from "../../../../assets/icons/plus.svg?react"

import styles from "./DashboardCase.module.css"


export default function DashboardCase({
  continueCase,
  isLoading
}) {
  
  const navigate = useNavigate();

  const caseExist = !Object.values(continueCase).every(value => value === null);
  const handleNewCase = () => navigate("/cases")
  const handleContinue = () => navigate(`/cases/sessions/${continueCase.attempt_id}`)
  
  return (
    <Box className={styles["dashboard-case-container"]}>
      {isLoading 
      ? (<h4>Loading</h4>) 
      : (
        <>
          <div className={styles["dashboard-case-container__text"]}>
            <h4>{ continueCase.title ?? "Ваш путь начинается здесь" }</h4>
            <p>{ caseExist 
            ? "Вы можете продолжить последний кейс или начать новый" 
            : "Вы ещё не проходили юридические кейсы. Начните любой сценарий и проверьте свои знания медицинского права."
            }</p>
          </div>
          <div className={styles["dashboard-case-container__btns"]}>
            {caseExist && 
              <Button 
                onClick={handleContinue}
                icon={PlayIcon} 
                className={styles["continue-btn"]}
              >
                Продолжить кейс
              </Button>
            }
            <Button 
              onClick={handleNewCase} 
              icon={PlusIcon} 
              className={
                caseExist 
                ? styles["new-btn"] 
                : styles["continue-btn"]
              }>
                Начать новый кейс
              </Button>
          </div>
        </>
      )}
    </Box>
  )
}
