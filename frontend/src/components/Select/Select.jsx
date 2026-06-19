import Box from "../Box/Box";

import ChevronDownIcon from "../../assets/icons/arrow-bottom.svg?react";

import styles from "./Select.module.css";


export default function Select({
  value,
  options,
  onChange,
  disabled = false,
  className
}) {
  return (
    <Box className={`${styles.wrapper} ${className ?? ""}`}>
      <select
        className={styles.select}
        value={value}
        disabled={disabled}
        onChange={onChange}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDownIcon className={styles.icon} />
    </Box>
  );
}