import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import AuthLayout from '../features/auth/AuthLayout.jsx'
import LoginForm from '../features/auth/LoginForm.jsx'
import RegisterForm from '../features/auth/RegisterForm.jsx'

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        Component: AuthLayout,
        children: [
          { path: "login", Component: LoginForm },
          { path: "register", Component: RegisterForm }
        ]
      }
    ]
  }
]);
