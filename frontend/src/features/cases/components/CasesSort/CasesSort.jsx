import Select from "../../../../components/Select/Select"

import styles from "./CasesSort.module.css"


const options = [
  // {
  //   value: "",
  //   label: "Не сортировать"
  // },
  {
    value: "newest",
    label: "Сначала новые"
  },
  {
    value: "oldest",
    label: "Сначала старые"
  },
  {
    value: "title",
    label: "По названию"
  },
  {
    value: "completed",
    label: "Сначала завершенные"
  },
  {
    value: "incompleted",
    label: "Сначала незавершеные"
  },
]

export default function CasesSort({
  value,
  onChange
}) {

  return (
    <Select 
      name="sort" 
      id="sort"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      options={options}
      className={styles.sort}
    >
    </Select>
  )
}