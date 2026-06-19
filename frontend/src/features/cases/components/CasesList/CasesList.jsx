import CaseCard from "../CaseCard/CaseCard"

import styles from "./CasesList.module.css"


export default function CasesList({
  casesList=[],
  isLoading,
  ...props
}) {

  return (
    <div 
      className={styles["cases-list"]}
      {...props}
    >
      {casesList && casesList.map((item) => (
        <CaseCard 
          key={item.id}
          caseData={item}
        />
      ))}
    </div>
  )

}