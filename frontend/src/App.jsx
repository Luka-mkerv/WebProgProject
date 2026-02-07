import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // THEME STATE
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  // ✅ Apply theme ONLY when logged in (Dashboard)
  useEffect(() => {
    if (user) {
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    } else {
      // ✅ Login always stays light
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }, [theme, user])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  // Load user from localStorage on app mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (err) {
        console.error('Error parsing saved user:', err)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')

    // ✅ Force theme back to light immediately on logout
    document.documentElement.setAttribute('data-theme', 'light')
  }

  if (loading) {
    return (
      <div className="app">
        <div style={{ padding: '20px' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="app">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  )
}

export default App

