import Nav from "../Nav/Nav"
import Logo from "../../components/Logo/Logo"

import "./SideBar.css"


export default function SideBar() {


  return (
    <aside className="sidebar">
      <Logo />
      <Nav />
    </aside>
  )
}