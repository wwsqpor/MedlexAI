import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { store } from "./app/store.js"
import App from './App.jsx'
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

import './styles/globals.css'
import './styles/variables.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>,
)
