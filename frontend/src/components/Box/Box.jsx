import styles from "./Box.module.css"


export default function Box({ className, children, ...props }) {


  return (
    <div 
      className={`${styles.box} ${className ? className : ""}`}
      {...props}
    >
      { children }
    </div>
  )
}