import styles from "./Input.module.css"


export default function Input({
  id,
  label,
  name,
  type="text",
  placeholder,
  value,
  onChange,
  error,
  className,
  ...props
}) {

  
  return (
    <label className={styles["label-tag"]} htmlFor={name}>
        <span className={styles.label}>{ label }</span>
        <input 
          id={id} 
          name={name}
          className={`${styles["form-input"]} ${className ?? ""}`} 
          type={type} 
          placeholder={placeholder} 
          value={value} 
          onChange={onChange}
          {...props}
        />
        {error && (
          <span className={styles["validation-error"]}>{error}</span>
        )}
      </label>  
  )
}