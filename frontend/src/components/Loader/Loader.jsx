import styles from "./Loader.module.css"


export default function Loader({
  className
}) {

  
  return (
    <div className={`${styles.loader} ${className ?? ""}`}>
      <div className={styles.spinner} />
    </div>
  )
}