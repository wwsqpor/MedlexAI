import { Link } from "react-router-dom"

import styles from "./NotFoundPage.module.css"
import blob from "../../assets/illustrations/blob.svg"
import notFoundImg from "../../assets/illustrations/404_img.svg"


export default function NotFoundPage() {


  return (
    <div className={styles["not-found-page"]}>
      <header className={styles.header}>
        <h1>Упс!</h1>
        <p>Вы потерялись</p>
      </header>

      <img className={styles.blob} src={blob} alt="" />
      <img className={styles["not-found-img"]} src={notFoundImg} alt="" />

      <Link className={styles.link} to="/dashboard">На главную</Link>
    </div>
  )
}