import { useState, useEffect } from 'react'
import './App.css'
import Auth from './components/Auth'
import Screen from './Screen'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)

  // Retrieve user details from localStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleAuthSuccess = (savedUser, savedToken) => {
    setToken(savedToken)
    setUser(savedUser)
    localStorage.setItem('token', savedToken)
    localStorage.setItem('user', JSON.stringify(savedUser))
  }

  const handleLogout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // If not authenticated, render login/register screen
  if (!token) {
    return <Auth onAuthSuccess={handleAuthSuccess} />
  }

  // Once authenticated, render main payments manager panel
  return (
    <>
      <Screen token={token} user={user} onLogout={handleLogout} />
    </>
  )
}
