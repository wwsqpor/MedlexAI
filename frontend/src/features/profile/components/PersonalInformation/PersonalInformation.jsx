import { useNavigate } from "react-router-dom"

import Box from "../../../../components/Box/Box"
import Button from "../../../../components/Button/Button"
import styles from "./PersonalInformation.module.css"
import { useProfile } from "../../hooks"
import { formatPhone } from "../../../../utils"


export default function PersonalInformation() {

  const navigate = useNavigate();
  const { user, isLoading } = useProfile();

  if (isLoading) {
    // console.log(isLoading)
    return <h2>Loading</h2>
  }

  return (
    <Box className={styles["personal-information"]}>
      <h4>Личная информация</h4>
      <div className={styles["user-info"]}>
        <div className={styles["user-info__avatar"]} />
        <div className={styles["user-info__table"]}>
          <div className={styles["main-row"]}>
            <p className={styles["main-row__fullname"]}>{user.name} {user.surname}</p>
            <span className={styles["main-row__role"]}>Студент</span>
          </div>
          <div className={styles["user-info__grid"]}>

            <span>Email: </span><span>{user.email}</span>
            
            <span>Телефон: </span><span>{formatPhone(user.phone_number) ?? "Не указан"}</span>
          
            <span>Организация: </span><span>{user.organization ?? "Не указана"}</span>
          
            <span>Специализация: </span><span>{user.specialization ?? "Не указана"}</span>
            
          </div>
        </div>
      </div>
      <div className={styles["btn-row"]}>
        <Button className={styles["edit-profile-btn"]} onClick={() => navigate("edit")}>Редактировать профиль</Button>
      </div>
    </Box>
  )
}