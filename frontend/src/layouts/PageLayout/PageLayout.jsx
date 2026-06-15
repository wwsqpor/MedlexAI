import MainLayout from "../MainLayout/MainLayout";
import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";

import "./PageLayout.css";


export default function PageLayout() {


  return (
    <div className="page-layout-grid">
      <Header />
      <SideBar />
      <MainLayout />
    </div>
  )
}