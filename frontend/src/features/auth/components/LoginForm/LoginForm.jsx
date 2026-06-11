import { useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";

import { useAuth } from "../../useAuth";
import { useAppDispatch } from "../../../../app/hooks";
import { login } from "../../authThunks";

import Button from '../../../../components/Button/Button'
import './LoginForm.css'
import googleIcon from '../../../../assets/icons/google-g-logo-icon.svg'


export default function LoginForm() {

  const { isLoading, error } = useAuth();
  const dispatch = useAppDispatch();
  
  const navigate = useNavigate() 

  const [rememberMe, setRememberMe] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ credentials, rememberMe }))
    console.log("Result: ", result);

    if (login.fulfilled.match(result)) {
      navigate("/profile");
      console.log("Redirecting to profile")
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
        <p className="welcome__message">Войдите в свой аккаунт, чтобы продолжить обучение</p>
      </div>

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
      </label>

      <div className="password-settings">
        <label htmlFor="remember-me">
          <input 
            className="form-input" 
            type="checkbox" 
            name="remember-me" 
            id="remember-me" 
            value={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}  
          />
          <span>Запомнить меня?</span>
        </label>
        <a href="">Забыли пароль?</a>
      </div>

      <Button disabled={isLoading}>{isLoading ? "Вход..." : "Войти"}</Button>

      <div className="or-br">
        <div className="br-line"></div>
        <span>ИЛИ</span>
        <div className="br-line"></div>
      </div>

      <Button className="google-sign-btn" icon={googleIcon}>Войти через Google</Button>

      <div className="bottom-nav">
        <span className="bottom-nav__no-account">
          Нет аккаунта?
        </span>
        <Link to="/register" className="bottom-nav__link">
          Зарегистрируйтесь
        </Link>
      </div>

      {error && (
        <p className="error">Неверный email или пароль</p>
      )}
    </form>
  )
}