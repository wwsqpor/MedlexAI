import Tag from "../../../../components/Tag/Tag"

import {
  difficultyMap
} from "../../../../utils"

import styles from "./CaseSessionHeader.module.css"


export default function CaseSessionHeader({
  title,
  difficulty
}) {

  return (
    <header className={styles["header"]}>
      <h4>
        { title }
      </h4>
      {difficulty && <Tag
        color={difficultyMap[difficulty].color}
      >
        { difficultyMap[difficulty].label }
      </Tag>}
    </header>
  )

}