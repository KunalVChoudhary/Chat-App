import {useContext} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { AuthContext } from '../context/authContext'

function App() {
  const {authUser} = useContext(AuthContext)
  return (
    <div className="bg-[url('./assets/bgimage.png')] bg-cover">
      <Routes>

        <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login" />} />
        <Route path='/login' element={authUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

      </Routes>
    </div>
  )
}

export default App