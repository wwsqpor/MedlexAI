import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useCurrentUserCaseSession } from "../../hooks"

import CaseSessionHeader from "../CaseSessionHeader/CaseSessionHeader";
import CaseSessionProgress from "../CaseSessionProgress/CaseSessionProgress";
import CaseSessionNavigation from "../CaseSessionNavigation/CaseSessionNavigation";

import styles from "./CaseSessionLayout.module.css"


export default function CaseSessionLayout() {

  const {
    currentSession,
    currentSessionStatus
  } = useCurrentUserCaseSession();

  const navigate = useNavigate();

  useEffect(() => {
    if (currentSessionStatus === "failed") {
      navigate("/cases");
    }
  }, [currentSessionStatus, navigate])

  if (currentSessionStatus === "loading" || currentSessionStatus === "idle") {
    return <h2>Loading</h2>
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