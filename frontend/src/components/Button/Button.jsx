import './Button.css'


export default function Button({ children, onClick, icon, className }) {
  return (
    <button className={"btn " + className} onClick={ () => onClick() }>
      {icon && 
      <img className="btn-icon" src={icon} alt="icon"/>}
      {children}
    </button>
  )
}