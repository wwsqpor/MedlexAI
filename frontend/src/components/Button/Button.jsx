import './Button.css'


export default function Button({ 
  children, 
  icon: Icon, 
  className,
  ...props
 }) {
  return (
    <button 
      className={"btn " + className} 
      {...props}
    >
      {Icon && 
      <Icon className="btn-icon" />
      }
      {children}
    </button>
  )
}