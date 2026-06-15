import { useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";

import { useAuth } from "../../hooks/";
import { useAppDispatch } from "../../../../app/hooks";
import { register, login } from "../../authThunks";

import Button from '../../../../components/Button/Button'
import './RegisterForm.css'


export default function RegisterForm() {

  const { isLoading, error } = useAuth();
  const dispatch = useAppDispatch();
  
  const navigate = useNavigate() 

  const [formValidationErrors, setFormValidationErrors] = useState({});
  const [credentials, setCredentials] = useState({
    fullname: "",
    email: "",
    password: "",
    passwordConfirmed: "",
  })

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  const validate = () => {
    const newErrors = {};

    if (!credentials.fullname.trim()) {
      newErrors.fullname = "Введите имя";
    } else if (credentials.fullname.trim().split(/\s+/).length !== 2) {
      newErrors.fullname = "Неправильный формат"
      console.log(credentials.fullname)
    }

    if (!credentials.email.trim()) {
      newErrors.email = "Введите email";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        credentials.email
      )
    ) {
      newErrors.email = "Некорректный email";
    }

    if (credentials.password.length < 8) {
      newErrors.password =
        "Пароль должен содержать минимум 8 символов";
    }

    if (
      credentials.password !==
      credentials.passwordConfirmed
    ) {
      newErrors.passwordConfirmed =
        "Пароли не совпадают";
    }

  setFormValidationErrors(newErrors);

  console.log(newErrors);
  
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const registerResult = await dispatch(register({
      email: credentials.email,
      name: credentials.fullname.split(" ")[0].trim(),
      surname: credentials.fullname.split(" ")[1].trim(),
      password: credentials.password
    })) 
    console.log("Register result: ", registerResult);
    
    const loginCredentials = {
      email: credentials.email,
      password: credentials.password
    }
    if (!registerResult.error) {
      console.log(loginCredentials)
      const loginResult = await dispatch(login({ credentials: loginCredentials, rememberMe: false }))
      
      console.log("Login result: ", loginResult)

      if (login.fulfilled.match(loginResult)) {
        navigate("/profile");
        console.log("Redirecting to profile")
      }
    }

  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="links">
        <NavLink to="/login" className="form-nav-link">Вход</NavLink>
        <NavLink to="/register" className="form-nav-link">Регистрация</NavLink>
      </div>
      <div className="welcome">
        <h3>Добро пожаловать!</h3>
        <p className="welcome__message">Создайте аккаунт, чтобы начать обучение</p>
      </div>

      <label htmlFor="fullname">
        <span>Полное имя</span>
        <input 
          id="fullname" 
          name="fullname"
          className="form-input" 
          type="text" 
          placeholder="Пример: Иван Иванов" 
          value={credentials.fullname} 
          onChange={handleChange}
        />
        {formValidationErrors.fullname && (
          <span className="validation-error">{formValidationErrors.fullname}</span>
        )}
      </label>

      <label htmlFor="email">
        <span>Email</span>
        <input 
          id="email" 
          name="email"
          className="form-input" 
          type="email" 
          placeholder="Введите ваш email" 
          value={credentials.email} 
          onChange={handleChange}
        />
        {formValidationErrors.email && (
          <span className="validation-error">{formValidationErrors.email}</span>
        )}
      </label>
      <label htmlFor="password">
        <span>Пароль</span>
        <input 
          id="password" 
          name="password"
          className="form-input" 
          type="password" 
          placeholder="Введите ваш пароль"
          value={credentials.password}
          onChange={handleChange}
        />
        {formValidationErrors.password && (
          <span className="validation-error">{formValidationErrors.password}</span>
        )}
      </label>

      <label htmlFor="password-confirmation">
        <span>Подтвердите пароль</span>
        <input 
          id="password-confirmation" 
          name="passwordConfirmed"
          className="form-input" 
          type="password" 
          placeholder="Подтвердите ваш пароль"
          value={credentials.passwordConfirmed}
          onChange={handleChange}
        />
        {formValidationErrors.passwordConfirmed && (
          <span className="validation-error">{formValidationErrors.passwordConfirmed}</span>
        )}
      </label>

      {/* <div className="password-settings">
        <label htmlFor="remember-me">
          <input className="form-input" type="checkbox" name="remember-me" id="remember-me" />
          <span>Запомнить меня?</span>
        </label>
        <a href="">Забыли пароль?</a>
      </div> */}

      <Button disabled={isLoading}>{isLoading ? "Регистрация..." : "Зарегистрироваться"}</Button>

      {/* <div className="or-br">
        <div className="br-line"></div>
        <span>ИЛИ</span>
        <div className="br-line"></div>
      </div>

      <Button className="google-sign-btn" icon={googleIcon}>Войти через Google</Button> */}

       <div className="bottom-nav">
        <span className="bottom-nav__have-account">
          Уже есть аккаунт?
        </span>
        <Link to="/login" className="bottom-nav__link">
          Войти
        </Link>
      </div>

      {error && (
        <p className="error">Ошибка: { JSON.stringify(error) }</p>
      )}
    </form>
  )
}