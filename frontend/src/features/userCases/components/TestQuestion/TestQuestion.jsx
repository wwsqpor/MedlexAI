import { useEffect, useState } from "react";

import { useTask } from "../../hooks";

import Box from "../../../../components/Box/Box"
import Button from "../../../../components/Button/Button"
import Input from "../../../../components/Input/Input"

import styles from "./TestQuestion.module.css"


export default function TestQuestion({
  className
}) {

  
  const { currentTask: task, currentTaskAnswer: taskAnswer } = useTask();

  const [selectedOption, setSelectedOption] = useState(null);


  return (
    <Box className={styles["test-question-task"]}>
      {/* <p>{JSON.stringify(task)}</p> */}
      <div className={styles.question}>
        <h4>Тестовый опрос: { task.title }</h4>
        <h5 className={styles["question-text"]}>{ task.instruction }</h5>
        
        <ul className={styles.options}>
          {task.options.map((item) => (
            <li key={item.id}>
              <label className={styles.option} htmlFor={item.id}>
                <input
                  id={item.id}
                  className={styles.radio}
                  type="radio"
                  checked={selectedOption === item.id}
                  onChange={() => setSelectedOption(item.id)}
                />

                <span className={styles["option-text"]}>
                  { item.text }
                </span>

              </label>
            </li>
          ))}
        </ul>
      </div>
      
    </Box>
  )
}