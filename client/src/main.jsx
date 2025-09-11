
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from '../context/authContext'
import { ChatProvider } from '../context/ChatContext.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ChatProvider>
  <     ToastContainer position="top-right" />
        <App />  
      </ChatProvider>
    </AuthProvider>
  </BrowserRouter>,
)
