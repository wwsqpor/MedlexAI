import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import AuthLayout from '../features/auth/components/AuthLayout/AuthLayout.jsx'
import LoginForm from '../features/auth/components/LoginForm/LoginForm.jsx'
import RegisterForm from '../features/auth/components/RegisterForm/RegisterForm.jsx'
import ProfilePage from '../pages/ProfilePage/ProfilePage.jsx';
import ProtectedRoute from "./ProtectedRoute.jsx"
import HomeRedirect from './HomeRedirect.jsx';
import PageLayout from '../layouts/PageLayout/PageLayout.jsx'
import EditProfilePage from '../pages/EditProfilePage/EditProfilePage.jsx';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage.jsx';
import DashboardPage from '../pages/DashboardPage/DashboardPage.jsx';
import CasesPage from '../pages/CasesPage/CasesPage.jsx';
import CasesLibrary from '../features/cases/components/CasesLibrary/CasesLibrary.jsx';
import CasesHistory from '../features/cases/components/CasesHistory/CasesHistory.jsx';
// import MainLayout from '../layouts/MainLayout/MainLayout.jsx';


export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomeRedirect
      },
      {
        Component: AuthLayout,
        children: [
          { path: "login", Component: LoginForm },
          { path: "register", Component: RegisterForm }
        ]
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            Component: PageLayout,
            children: [
              {
                path: "profile",
                Component: ProfilePage,
              },
              {
                path: "profile/edit",
                Component: EditProfilePage
              },
              {
                path: "dashboard",
                Component: DashboardPage
              },
              {
                path: "cases",
                Component: CasesPage,
                children: [
                  {
                    index: true,
                    Component: CasesLibrary
                  },
                  {
                    path: "history",
                    Component: CasesHistory
                  }

                ]
              }
            ],
          },
        ],
      }
    ]
  },
  {
    path: "*",
    Component: NotFoundPage
  }
]);
