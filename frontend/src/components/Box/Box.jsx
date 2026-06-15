import styles from "./Box.module.css"


export default function Box({ className, children }) {


  return (
    <div className={`${styles.box} ${className ? className : ""}`}>
      { children }
    </div>
  )
}