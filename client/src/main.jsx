
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from '../context/authContext'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ToastContainer position="top-right" />
      <App />  
    </AuthProvider>
  </BrowserRouter>,
)
