import { useEffect, useState } from "react";

import { useTask } from "../../hooks";

import Box from "../../../../components/Box/Box"
import Button from "../../../../components/Button/Button"

import styles from "./TestQuestion.module.css"


export default function TestQuestion({
  className
}) {

  
  const { 
    sessionId,
    currentTask: task, 
    currentTaskAnswer: taskAnswer, 
    submitTaskAnswer,
    saveAnswer,
    preSubmittedUserAnswers, 
  } = useTask();

  // const [selectedOption, setSelectedOption] = useState(taskAnswer?.selected_options?.[0]);
  const selectedOption =
    taskAnswer?.selected_options?.[0] ??
    preSubmittedUserAnswers[
      `${sessionId}-${task?.id}`
    ]?.selected_option_ids?.[0] ??
    null;
    
  const handleChange = (value) => {
    // debouncedSave(e.target.value);
    saveAnswer({
      selected_option_ids: [value]
    });
  }
  

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
                  className={`
                    ${styles.radio} 
                    ${taskAnswer?.is_correct && taskAnswer?.selected_options?.[0] === item.id 
                      ? styles.correct 
                      : styles.incorrect
                    }`}
                  type="radio"
                  checked={selectedOption === item.id}
                  onChange={() => handleChange(item.id)}
                  disabled={taskAnswer?.selected_options?.[0] ? true : false}
                />

                <span className={styles["option-text"]}>
                  { item.text }
                </span>

              </label>
            </li>
          ))}
        </ul>
      </div>
      { taskAnswer && 
        <div className={`${styles["ai-feedback"]} ${taskAnswer?.is_correct 
          ? styles["ai-feedback__correct"] 
          : styles["ai-feedback__incorrect"]}`
        }>
          <h5>Объяснение</h5>
          <p>
            {taskAnswer?.ai_feedback}
          </p>
        </div>
      }
    </Box>
  )
}