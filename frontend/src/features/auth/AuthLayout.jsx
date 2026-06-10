import { Outlet } from "react-router-dom"
import './AuthLayout.css'


export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__left">
        <div className="logo">
          <img className ="logo__img" src="logo.svg" alt="Logo" />
          <div className="logo__text">
            <h2>MEDLEX AIB</h2>
            <p className="postscript">Медицинское право с искусственным интеллектом</p>
          </div>
        </div>
        <div className="info">
          <h2>Учитесь принимать юридически правильные решения в медицине</h2>
          <p>Ai-тренажер на основе реальных клинических кейсов и законадательства Республики Казахстан</p>
        </div>
        <div className="features">
          <div className="feature">
            <div className="feature__rect-icon"></div>
            <div className="feature__text">
              <p className="feature__text-title">Реальные кейсы</p>
              <span className="feature__text-description">Ситуация из практики и судебных решений</span>
            </div>
          </div>
          <div className="feature">
            <div className="feature__rect-icon"></div>
            <div className="feature__text">
              <p className="feature__text-title">Реальные кейсы</p>
              <span className="feature__text-description">Ситуация из практики и судебных решений</span>
            </div>
          </div>
          <div className="feature">
            <div className="feature__rect-icon"></div>
            <div className="feature__text">
              <p className="feature__text-title">Реальные кейсы</p>
              <span className="feature__text-description">Ситуация из практики и судебных решений</span>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-layout__right">
        <Outlet />
      </div>
    </div>
  )
}