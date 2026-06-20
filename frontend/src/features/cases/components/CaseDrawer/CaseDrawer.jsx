import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useSelectedCase } from "../../hooks";
import { fetchCaseDetails } from "../../casesThunks";
import { selectCaseDetails, selectCaseDetailsStatus } from "../../casesSelectors";

import Box from "../../../../components/Box/Box"
import Tag from "../../../../components/Tag/Tag"
import Button from "../../../../components/Button/Button"

import PlayIcon from "../../../../assets/icons/play.svg?react"

import styles from "./CaseDrawer.module.css"


const difficultyMap = {
  easy: {
    label: "Легкий",
    color: "success"
  },
  medium: {
    label: "Средний",
    color: "yellow"
  },
  hard: {
    label: "Сложный",
    color: "warning"
  }
}

export default function CaseDrawer({
  className,
}) {

  const navigate = useNavigate()

  const dispatch = useAppDispatch();

  const caseDetails = useAppSelector(selectCaseDetails);
  const caseDetailsStatus = useAppSelector(selectCaseDetailsStatus);

  const { selectedCaseId, closeCase } = useSelectedCase();

  useEffect(() => {
    
    if (!selectedCaseId || Number(selectedCaseId) === caseDetails?.id) return;

    const isSame = caseDetails?.id === Number(selectedCaseId);

    if (!isSame) {
      dispatch(fetchCaseDetails(selectedCaseId))
    }

  }, [selectedCaseId, caseDetails, dispatch])

  
  if (!selectedCaseId) {
    return null;
  } 
  
  if (caseDetailsStatus === "loading") {
    return <h3>Loading</h3>
  }

  const handleStartCase = () => {
    navigate(`/cases/sessions/${caseDetails.id}`)
  }

  return (
    <div 
      className={`${styles.overlay}`}
      onClick={closeCase}  
    >
      <Box
        className={`${styles.drawer} ${!selectedCaseId ? styles.close : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h4>{caseDetails?.title}</h4>
        <div className={styles.tags}>
          <Tag
            color={difficultyMap[caseDetails?.difficulty]?.color}
          >
            {difficultyMap[caseDetails?.difficulty]?.label}
          </Tag>
        </div>
        <div className={styles.description}>
          <h5>Описание</h5>
          <p>{caseDetails?.full_description}</p>
        </div>
        <Button
          className={styles.btn}
          icon={PlayIcon}
          onClick={() => handleStartCase(caseDetails.id)}
        >
          Начать кейс
        </Button>
      </Box>
    </div>
  )

}