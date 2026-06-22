import { useState } from "react";

import { useTask } from "../../hooks";

import Box from "../../../../components/Box/Box"
import Button from "../../../../components/Button/Button"

import styles from "./OpenQuestion.module.css"


export default function OpenQuestion({
  className
}) {

  
  const { currentTask: task, submitTaskAnswer, currentTaskAnswer: taskAnswer } = useTask();
  
  const [answer, setAnswer] = useState(taskAnswer?.open_answer ? taskAnswer?.open_answer : "");


  return (
    <Box className={styles["open-question-task"]}>
      <div className={styles.question}>

        <h4>Открытый опрос</h4>
        <p>{ task.title }</p>
        <textarea 
          className={styles.input}
          name="answer" 
          id="answer"
          placeholder="Введите ваш ответ..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={taskAnswer?.open_answer ? true : ""}
          />
      </div>
      <Button
        onClick={() => submitTaskAnswer({ openAnswer: answer })}
        disabled={taskAnswer?.open_answer ? true : ""}
      >
        Проверить
      </Button>
      {taskAnswer && 
      <>
        <div className={styles.correct}>
          <h4>Правильный ответ</h4>
          <p>{ taskAnswer.ai_correct_answer }</p>
        </div>
        <div className={styles.feedback}>
          <h4>Обратная связь</h4>
          <p>{ taskAnswer.ai_feedback }</p>
        </div>
        
        <div className={styles["what-is-correct"]}>
          <h5>Что правильно</h5>
          <ul>
            {taskAnswer.ai_what_is_correct.map((item, index) => (
              <li key={index}>{ `${index + 1}. ${item}` }</li>
            ))}
          </ul>
        </div>
        <div className={styles["what-is-missing"]}>
          <h5>Чего не хватает</h5>
          <ul >
            {taskAnswer.ai_what_is_missing.map((item, index) => (
              <li key={index}>{ `${index + 1}. ${item}` }</li>
            ))}
          </ul>
        </div>
      </>
      }
    </Box>
  )
}