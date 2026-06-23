

import styles from "./AITutorHeader.module.css";


export default function AITutorHeader() {

  return (
    <header>
      <h3>AI Тьютор</h3>
      <p className={styles.text}>Задавайте вопросы по медицинским правовым кейсам</p>
    </header>
  )
}