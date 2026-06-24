import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

import { useProfile } from "../../../features/profile/hooks";
import { useAppDispatch } from "../../../app/hooks";
import { logout } from "../../../features/auth/authThunks";

import Button from "../../../components/Button/Button"
import Box from "../../../components/Box/Box"

import styles from "./UserMenu.module.css"
import { Link } from "react-router-dom";


export default function UserMenu() {

  const { user } = useProfile()
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  }

  return (
    <div ref={ref} className={styles.wrapper}>
      <Button className={`${styles["btn-reset"]} ${styles["profile-preview"]}`}
        onClick={() => setOpen((prev) => !prev)}
      >
          {/* <img src="" alt=" " /> */}
          <div className={styles["profile-preview__img"]}></div>
          <div className={styles["profile-preview__details"]}>
            <p className={styles["profile-preview__details-fullname"]}>{user?.name} {user?.surname && `${user?.surname[0]}.`}</p>
            <span className={styles["profile-preview__details-role"]}>Студент</span>
          </div>
        </Button>

        <Box className={`${styles.dropdown} ${open ? styles.open : ""}`}>
          <nav>
            <ul className={styles["dropdown-list"]}>
              <li><Link to="/profile" className={`${styles["nav-btn"]} ${styles["btn-reset"]}`}>Профиль</Link></li>
              <li><Button onClick={handleLogout} className={`${styles["nav-btn"]} ${styles["btn-reset"]} ${styles["log-out"]}`}>Выйти</Button></li>
            </ul>
          </nav>
        </Box>
    </div>
  )

}