import Button from '../../components/Button/Button'
import './LoginForm.css'
import googleIcon from '../../assets/icons/google-g-logo-icon-11609362962anodywxeaz.svg'


export default function LoginForm() {
  return (
    <form className="form" action="">
      <div className="links">
        <a href="">Вход</a>
        <a href="">Регистрация</a>
      </div>
      <div className="welcome">
        <h3>Добро пожаловать!</h3>
        <p className="welcome__message">Войдите в свой аккаунт, чтобы продолжить обучение</p>
      </div>

      <label htmlFor="email">
        <span>Email</span>
        <input id="email" className="form-input" type="email" placeholder="Введите ваш email"/>
      </label>
      <label htmlFor="password">
        <span>Пароль</span>
        <input id="password" className="form-input" type="password" placeholder="Введите ваш пароль"/>
      </label>

      <div className="password-settings">
        <label htmlFor="remember-me">
          <input className="form-input" type="checkbox" name="remember-me" id="remember-me" />
          <span>Запомнить меня?</span>
        </label>
        <a href="">Забыли пароль?</a>
      </div>

      <Button>Войти</Button>

      <div className="or-br">
        <div className="br-line"></div>
        <span>ИЛИ</span>
        <div className="br-line"></div>
      </div>

      <Button className="google-sign-btn" icon={googleIcon}>Войти через Google</Button>

    </form>
  )
}