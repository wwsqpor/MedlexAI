import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

import { useCurrentUserCaseSession } from "../../hooks"

import CaseSessionHeader from "../CaseSessionHeader/CaseSessionHeader";
import CaseSessionProgress from "../CaseSessionProgress/CaseSessionProgress";
import CaseSessionNavigation from "../CaseSessionNavigation/CaseSessionNavigation";
import Loader from "../../../../components/Loader/Loader"

import styles from "./CaseSessionLayout.module.css"


export default function CaseSessionLayout() {

  const {
    currentSession,
    currentSessionStatus
  } = useCurrentUserCaseSession();

  if (currentSessionStatus === "loading" || currentSessionStatus === "idle") {
    return <Loader />
  }
 
  if (currentSessionStatus === "failed") {
    return <Navigate to="/cases" />
  }


  return (
    <div className={styles["case-session-layout"]}>
      <CaseSessionHeader title={currentSession.case_title} />
      <CaseSessionProgress />
      <Outlet />
      <CaseSessionNavigation />
    </div>
  )
}