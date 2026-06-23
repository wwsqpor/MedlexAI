import { Outlet } from "react-router-dom"

import CaseIcon from "../../../../assets/icons/case.svg?react"
import BarChartIcon from "../../../../assets/icons/bar-chart.svg?react"
import BrainIcon from "../../../../assets/icons/brain.svg?react"

import './AuthLayout.css'


export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__left">
        <div className="logo">
          <img className ="logo__img" src="logo.svg" alt="Logo" />
          <div className="logo__text">
            <h2>MEDLEX AI</h2>
            <p className="postscript">Медицинское право с искусственным интеллектом</p>
          </div>
        </div>
        <div className="info">
          <h2>Учитесь принимать юридически правильные решения в медицине</h2>
          <p>Ai-тренажер на основе реальных клинических кейсов и законодательства Республики Казахстан</p>
        </div>
        <div className="features">
          <div className="feature">
            <div className="feature__rect-icon">
              <CaseIcon />
            </div>
            <div className="feature__text">
              <p className="feature__text-title">Реальные кейсы</p>
              <span className="feature__text-description">Ситуация из практики и судебных решений</span>
            </div>
          </div>
          <div className="feature">
            <div className="feature__rect-icon">
              <BarChartIcon />
            </div>
            <div className="feature__text">
              <p className="feature__text-title">Персональная аналитика</p>
              <span className="feature__text-description">Отслеживайте свой прогресс и улучшайте навыки</span>
            </div>
          </div>
          <div className="feature">
            <div className="feature__rect-icon">
              <BrainIcon />
            </div>
            <div className="feature__text">
              <p className="feature__text-title">AI-анализ ответов</p>
              <span className="feature__text-description">Проверка на соотвествие законодательству РК</span>
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