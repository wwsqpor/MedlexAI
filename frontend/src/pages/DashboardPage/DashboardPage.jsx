import Dashboard from "../../features/dashboard/components/Dashboard/Dashboard"


export default function DashboardPage() {
  return <Dashboard />
}


// import { useEffect } from "react";

// import { useAppDispatch } from "../../app/hooks";
// import { useDashboard } from "../../features/dashboard/hooks"
// import { fetchDashboard } from "../../features/dashboard/dashboardThunks"

// import DashboardHeader from "../../features/dashboard/components/DashboardHeader/DashboardHeader"
// import DashboardInfoCard from "../../features/dashboard/components/DashboardInfoCard/DashboardInfoCard";
// import DashboardCase from "../../features/dashboard/components/DashboardCase/DashboardCase";
// import DashboardProgress from "../../features/dashboard/components/DashboardProgress/DashboardProgress";

// import DocumentFileIcon from "../../assets/icons/document-file.svg?react"
// import IncreaseIcon from "../../assets/icons/increase.svg?react"
// import DecreaseIcon from "../../assets/icons/decrease.svg?react"
// import FolderIcon from "../../assets/icons/folder.svg?react"
// import CupIcon from "../../assets/icons/cup.svg?react"

// import styles from "./DashboardPage.module.css"


// export default function DashboardPage() {

//   const dispatch = useAppDispatch();
//   useEffect(() => {
//     dispatch(fetchDashboard())
//   }, [dispatch]);
//   const { stats, continueCase, progress, isLoading } = useDashboard();

//   if (isLoading || !stats) {
//     return <h1>Loading</h1>
//   }

//   return (
//     <div className={styles["dashboard-page"]}>
//       <DashboardHeader className={styles.header}/>
//       <div className={styles["info-cards-container"]}>
//         <DashboardInfoCard 
//           Icon={DocumentFileIcon}
//           color="purple"
//           title="Пройдено кейсов" 
//           value={stats.completed_cases} 
//           trendColor={stats.completed_this_week > 0 ? "success" : "purple"}
//           trend={`${stats.completed_this_week > 0 ? "+" : ""} ${stats.completed_this_week} за неделю`}/>
//         <DashboardInfoCard 
//           Icon={stats.score_change >= 0 ? IncreaseIcon : DecreaseIcon}
//           // IconAlternative={DecreaseIcon}
//           color={stats.score_change >= 0 ? "success" : "warning"}
//           title="Средний балл" 
//           value={stats.average_score} 
//           trendColor={stats.score_change > 0 ? "success" : ""}
//           trend={`${stats.score_change > 0 ? "+" : stats.score_change < 0 ? "-" : ""} ${stats.score_change}% за неделю`}/>
//         <DashboardInfoCard 
//           Icon={FolderIcon}
//           color="blue"
//           title="Последний кейс" 
//           value={stats.last_case.title ?? "-"} 
//           trend={stats.last_case.last_case ? stats.last_case.score : "-"}/>
//         <DashboardInfoCard 
//           Icon={CupIcon}
//           color="yellow"
//           title="Лучший результат" 
//           value={stats.best_result.score ?? "-"} 
//           trend={stats.best_result.title ? `Кейс: ${stats.best_result.title}` : "-"}/>
//       </div>

//       <DashboardCase continueCase={continueCase} isLoading={isLoading}/>
//       <DashboardProgress progress={progress} isLoading={isLoading}/>
//     </div>
//   )
// }