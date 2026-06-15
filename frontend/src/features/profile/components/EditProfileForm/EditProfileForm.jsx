import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

import Box from "../../../../components/Box/Box"
import Button from "../../../../components/Button/Button"
import Input from "../../../../components/Input/Input"
import PhoneInput from "../../../../components/PhoneInput/PhoneInput"
import styles from "./EditProfileForm.module.css"
import { useProfile } from "../../hooks"
import { useAppDispatch } from "../../../../app/hooks"
import { updateProfile } from "../../profileThunks"
import { formatPhone, getChangedFields } from "../../../../utils"

const INITIAL_FORM = {
  surname: "",
  name: "",
  email: "",
  phone_number: "",
  organization: "",
  specialization: "",
};

export default function EditProfileForm() {
  
  const { user, isLoading } = useProfile()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState(INITIAL_FORM) 
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!user || isInitialized) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      surname: user.surname ?? "",
      name: user.name ?? "",
      email: user.email ?? "",
      phone_number: user.phone_number ? formatPhone(user.phone_number) : "",
      organization: user.organization ?? "",
      specialization: user.specialization ?? "",
    })
    setIsInitialized(true);
  }, [user, isInitialized])


  if (isLoading) {
    return <div>Loading</div>
  }

  // console.log("FORM: ", formData);

  const handleChange = (e) => {
    e.preventDefault();

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phone_number: value,
    }));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = getChangedFields(formData, user);

      // console.log("Payload: ", payload);

    if (Object.keys(payload).length === 0) {
      navigate(-1);
      return;
    }

    await dispatch(updateProfile(payload));
  }

  return (
    <Box className={styles["profile-edit-form"]}>
      <div className={styles["profile-edit-form__fullname"]}>
        <Input 
          className={styles.surname} 
          label="Фамилия" 
          id="surname" 
          name="surname" 
          placeholder={"Не указана"}
          value={formData.surname}
          onChange={handleChange}  
        />
        <Input 
          className={styles.name} 
          label="Имя" 
          id="name" 
          name="name" 
          placeholder={"Не указано"}
          value={formData.name}
          onChange={handleChange}
          
        />
      </div>
      <Input 
        label="Email" 
        id="email" 
        name="email" 
        type="email"
        placeholder={"Не указан"}
        value={formData.email}
        onChange={handleChange}  
      />
      {/* <Input 
        label="Телефон" 
        id="phone" 
        name="phone" 
        type="tel"
        placeholder={user?.phone ?? "Не указан"}
        value={formData.phone}
        onChange={handleChange}
        onFocus={handlePhoneFocus}  
      /> */}
      <PhoneInput 
        label="Телефон"
        id="phone_number"
        name="phone_number"
        placeholder={"Не указан"}
        value={formData.phone_number}
        onAccept={handlePhoneChange}
      />
      <Input 
        label="Организация" 
        id="organization" 
        name="organization" 
        placeholder={"Не указана"}
        value={formData.organization}  
        onChange={handleChange}
      />
      <Input 
        label="Специализация" 
        id="specialization" 
        name="specialization" 
        placeholder={"Не указана"}
        value={formData.specialization}
        onChange={handleChange}  
      />

      <div className={styles["profile-edit-form__btns"]}>
        <Button className={styles["cancel-btn"]} onClick={handleCancel}>Отмена</Button>
        <Button className={styles["save-btn"]} onClick={handleSubmit}>Сохранить изменения</Button>
      </div>
    </Box>
  )
}