import { useParams } from "react-router-dom"

import { useCurrentUserCaseSession } from "../../hooks"

import CaseDescription from "../CaseDescription/CaseDescription"
import OpenQuestion from "../OpenQuestion/OpenQuestion"
import TestQuestion from "../TestQuestion/TestQuestion"

import styles from "./TaskLayout.module.css"

const taskComponents = {
  open: OpenQuestion,
  test: TestQuestion,
}


export default function TaskLayout() {

  const { taskId } = useParams();

  const { currentSession, currentSessionStatus } = useCurrentUserCaseSession(); 
  
  const currentTask = currentSession?.tasks?.[taskId - 1];

  const TaskComponent = taskComponents[currentTask?.task_type]

  

  if (!TaskComponent) {
    return null;
  }

  return (
    <div className={styles["task-layout"]}>
      <CaseDescription description={currentSession.case.full_description}/>
      {
        <TaskComponent task={currentTask}/>
      }
    </div>
  )
}