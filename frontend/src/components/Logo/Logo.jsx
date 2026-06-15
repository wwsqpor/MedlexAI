import styles from "./Logo.module.css";


export default function Logo() {
  return (
    <div className={styles.logo}>
      <img src="logo.svg" alt="logo" className={styles["logo__img"]}/>
      <div className={styles["logo__text"]}>
        <h4>MEDLEX AIB</h4>
        <span>Медицинское право с искусственным интеллектом</span>
      </div>
    </div>
  )
}