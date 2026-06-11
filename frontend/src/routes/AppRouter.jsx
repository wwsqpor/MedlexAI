import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import AuthLayout from '../features/auth/components/AuthLayout/AuthLayout.jsx'
import LoginForm from '../features/auth/components/LoginForm/LoginForm.jsx'
import RegisterForm from '../features/auth/components/RegisterForm/RegisterForm.jsx'
import ProfilePage from '../pages/ProfilePage/ProfilePage.jsx';
import ProtectedRoute from "./ProtectedRoute.jsx"
import HomeRedirect from './HomeRedirect.jsx';


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
            path: "profile",
            Component: ProfilePage,
          }
        ]
      },
    ]
  }
]);
