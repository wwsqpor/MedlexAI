import SearchIcon from "../../../../assets/icons/search.svg?react"

import styles from "./CasesSearch.module.css"


export default function CasesSearch({
  value,
  onChange
}) {


  return (
    <div className={styles["input-wrapper"]}>
      <SearchIcon className={styles["input-wrapper__icon"]}/>
      <input 
        id="search"
        name="search"
        className={styles["input-wrapper__cases-search"]}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Поиск кейсов..."
        />
    </div>
  )
}