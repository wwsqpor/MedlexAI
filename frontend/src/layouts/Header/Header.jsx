
import UserMenu from "./UserMenu/UserMenu"

import styles from "./Header.module.css"


export default function Header() {

  return (
    <header className={styles.header}>
      <UserMenu />
    </header>
  )
}