import './Button.css'


export default function Button({ 
  children, 
  icon, 
  className,
  ...props
 }) {
  return (
    <button 
      className={"btn " + className} 
      {...props}
    >
      {icon && 
      <img className="btn-icon" src={icon} alt="icon"/>}
      {children}
    </button>
  )
}