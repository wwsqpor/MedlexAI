import { NavLink } from "react-router-dom"

import HomeIcon from "../../assets/icons/home.svg?react" 
import CaseIcon from "../../assets/icons/case.svg?react"
import RobotIcon from "../../assets/icons/robot.svg?react"
import ProfileIcon from "../../assets/icons/profile.svg?react"
import styles from "./Nav.module.css"


export default function Nav() {

  const navItems = [
    {
      path: "/dashboard",
      label: "Главная",
      icon: HomeIcon
    },
    {
      path: "/cases",
      label: "Работа с кейсами",
      icon: CaseIcon
    },
    {
      path: "/ai-tutor",
      label: "AI-Тьютор",
      icon: RobotIcon
    },
    {
      path: "/profile",
      label: "Профиль",
      icon: ProfileIcon
    }

  ]

  return (
    <nav className={styles["nav-container"]}>
      {navItems.map((navItem) => {
        const Icon = navItem.icon;
        return (
          <NavLink 
            to={navItem.path}
            key={navItem.label} 
            className={({isActive}) => {
              return isActive
               ? `${styles["nav-link"]} ${styles.active}`
               : `${styles["nav-link"]}`
            }}
          > 
            <Icon className={styles.icon}/>
            <span>
              {navItem.label}
            </span> 
          </NavLink>
        )
      })}
    </nav>
  )
}