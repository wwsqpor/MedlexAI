import { useEffect, useState, useRef } from "react";

import Box from "../Box/Box"

import DropdownIcon from "../../assets/icons/arrow-bottom.svg?react"

import styles from "./Dropdown.module.css";


export default function Dropdown({
  trigger,
  children,
  className
}) {

  const [isOpen, setIsOpen] = useState(false);
  // const ref = useRef(null);

  // useEffect(() => {

  //   const handleClickOutside

  // }, [])

  return (
    <Box className={`
      ${styles.dropdown} 
      ${className}
    `}>
      <div 
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        { trigger }
        <DropdownIcon 
          className={`${styles.icon} ${isOpen ? styles["icon-up"] : ""}`}/>
      </div> 
      
      <div
        className={`
          ${styles.menu}
          ${isOpen ? styles.open : ""}
        `}
      >
        { children }
      </div>

    </Box>
  )

}