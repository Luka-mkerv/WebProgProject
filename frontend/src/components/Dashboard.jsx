import { useState, useEffect } from 'react'
import axios from 'axios'
import ShiftList from './ShiftList'
import EmployeeList from './EmployeeList'
import RequestList from './RequestList'
import ShiftCalendar from './ShiftCalendar'
import Analytics from './Analytics'
import NotificationBell from './NotificationBell'

const API_URL = 'http://localhost:5000/api'

function Dashboard({ user, onLogout, theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('shifts')
  const [shifts, setShifts] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const shiftRes = await axios.get(`${API_URL}/shifts`)
      const empRes = await axios.get(`${API_URL}/employees`)
      setShifts(shiftRes.data)
      setEmployees(empRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading dashboard...</div>

  return (
    <div className="dashboard">
      {/* ===== SIDEBAR ===== */}
      <div className="dashboard-nav">
        <div className="nav-top">
          <button
            className={`nav-btn ${activeTab === 'shifts' ? 'active' : ''}`}
            onClick={() => setActiveTab('shifts')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 3h10v4H7z" fill="#00d4ff" />
                <path d="M5 7h14v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7z" fill="#fff" stroke="#cbd5e1" />
              </svg>
              Shifts
            </span>
          </button>

          {user.role !== 'Employee' && (
            <button
              className={`nav-btn ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveTab('employees')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="3" fill="#0066ff" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />
                </svg>
                Employees
              </span>
            </button>
          )}

          {/* ✅ REQUESTS BACK */}
          <button
            className={`nav-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z"
                  fill="#fff"
                  stroke="#cbd5e1"
                />
                <path d="M4 6l8 7 8-7" stroke="#0066ff" strokeWidth="1.2" fill="none" />
              </svg>
              Requests
            </span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" fill="#fff" stroke="#cbd5e1" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="#0066ff" strokeWidth="1.2" />
              </svg>
              Calendar
            </span>
          </button>

          {user.role !== 'Employee' && (
            <button
              className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="4" height="18" rx="1" fill="#00d4ff" />
                  <rect x="10" y="8" width="4" height="13" rx="1" fill="#0099ff" />
                  <rect x="17" y="12" width="4" height="9" rx="1" fill="#667eea" />
                </svg>
                Reports
              </span>
            </button>
          )}
        </div>

        <div className="nav-separator"></div>

        <div className="nav-bottom">
          <div className="nav-user-info">
            <p className="nav-user-name">{user.name}</p>
            <p className="nav-user-role">{user.role}</p>
          </div>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="dashboard-content">
        {/* TOP BAR INSIDE CONTENT */}
        <div className="content-topbar">
          <div className="content-title">
            {activeTab === 'shifts' && 'Shift Management'}
            {activeTab === 'employees' && 'Employees'}
            {activeTab === 'requests' && 'Requests'}
            {activeTab === 'calendar' && 'Calendar'}
            {activeTab === 'analytics' && 'Reports'}
          </div>

          <div className="content-actions" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <NotificationBell userId={user._id} />

            <button
  className="theme-toggle"
  onClick={toggleTheme}
  aria-label="Toggle theme"
>
  {theme === 'light' ? (
    // Moon icon
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
        fill="currentColor"
      />
    </svg>
  ) : (
    // Sun icon
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="23" />
        <line x1="1" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="23" y2="12" />
        <line x1="4.2" y1="4.2" x2="6.3" y2="6.3" />
        <line x1="17.7" y1="17.7" x2="19.8" y2="19.8" />
        <line x1="4.2" y1="19.8" x2="6.3" y2="17.7" />
        <line x1="17.7" y1="6.3" x2="19.8" y2="4.2" />
      </g>
    </svg>
  )}
</button>

          </div>
        </div>

        {/* TAB CONTENT */}
        {activeTab === 'shifts' && <ShiftList user={user} />}
        {activeTab === 'employees' && <EmployeeList user={user} />}
        {activeTab === 'requests' && <RequestList user={user} />}
        {activeTab === 'calendar' && <ShiftCalendar shifts={shifts} employees={employees} />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  )
}

export default Dashboard
