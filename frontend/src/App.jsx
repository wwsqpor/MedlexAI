import { useEffect } from "react";
import { RouterProvider } from "react-router/dom";
import { router } from './routes/AppRouter.jsx'

import { useAppDispatch } from "./app/hooks";
import { initializeAuth } from "./features/auth/authThunks.js";
import { fetchProfile } from "./features/profile/profileThunks.js";


export default function App() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth()).unwrap().then(() => dispatch(fetchProfile()))
    console.log("initialize auth");
  }, [])

  return <RouterProvider router={router} />
}