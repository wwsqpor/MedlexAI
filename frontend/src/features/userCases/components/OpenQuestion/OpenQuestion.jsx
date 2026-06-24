import { useMemo, useState } from "react";

import { useTask } from "../../hooks";

import Box from "../../../../components/Box/Box"
import Button from "../../../../components/Button/Button"

import styles from "./OpenQuestion.module.css"
import { debounce } from "../../../../utils/debounce";


export default function OpenQuestion({
  className
}) {

  
  const { 
    currentTask: task,
    currentTaskAnswer: taskAnswer, 
    sessionId,
    submitAnswerStatus,
    saveAnswer,
    preSubmittedUserAnswers,
  } = useTask();
  
  const answer =
    taskAnswer?.open_answer ??
    preSubmittedUserAnswers[
      `${sessionId}-${task?.id}`
    ]?.open_answer ??
    "";

  // const debouncedSave = useMemo(
  //   () => (
  //     debounce((value) => {
  //       saveAnswer({
  //         open_answer: value
  //       });
  //     }, 500)
  //   )
  // , [saveAnswer])

  const handleChange = (e) => {
    e.preventDefault();
    // debouncedSave(e.target.value);
    saveAnswer({
      open_answer: e.target.value
    });
  }

  return (
    <Box className={styles["open-question-task"]}>
      <div className={styles.question}>

        <h4>Открытый опрос</h4>
        <p>{ task.title }</p>
        <p className={styles.instruction}>{ task.instruction }</p>
        <textarea 
          className={styles.input}
          name="answer" 
          id="answer"
          placeholder="Введите ваш ответ..."
          value={answer}
          onChange={handleChange}
          disabled={taskAnswer?.open_answer ? true : ""}
          />
      </div>
      {taskAnswer && 
      <>
        <div className={styles.correct}>
          <h4>Ответ ИИ</h4>
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