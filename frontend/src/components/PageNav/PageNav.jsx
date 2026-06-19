import { NavLink } from "react-router-dom"

import styles from "./PageNav.module.css"


export default function PageNav({
  navList
}) {

  return (
    <div className={styles["page-nav-container"]}>
      {navList.map(({label, path, end}) => {
        return <NavLink 
          className={({isActive}) => 
            `${styles["page-nav-container__link"]} ${isActive ? styles.active : ""}`} 
          to={path} 
          end={end}
          key={path}
        >
          { label }
        </NavLink>
      })}
    </div>
  )
}