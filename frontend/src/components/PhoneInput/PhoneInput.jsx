import { IMaskInput }from "react-imask"
import styles from "./PhoneInput.module.css"


export default function PhoneInput({
  label,
  value,
  onAccept,
  className,
  error,
  ...props
}) {

  return (
    <label className={styles["label-tag"]} htmlFor={name}>
      <span className={styles.label}>{ label }</span>
      <IMaskInput
        mask="+7 (000) 000-00-00"
        value={value}
        onAccept={onAccept}
        className={`${styles["form-input"]} ${className ?? ""}`} 
        {...props}
      />
      {error && (
        <span className={styles["validation-error"]}>{error}</span>
      )}
    </label> 
  )
}