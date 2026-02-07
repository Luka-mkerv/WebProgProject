import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState([])

  useEffect(() => {
    fetchCredentials()
  }, [])

  const fetchCredentials = async () => {
    try {
      const response = await axios.get(`${API_URL}/credentials`)
      setCredentials(response.data)
    } catch (err) {
      console.error('Error fetching credentials:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password
      })

      if (response.data.success) {
        onLogin(response.data.user)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (u, p) => {
    setUsername(u)
    setPassword(p)
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '600px 1fr',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative gradient orbs */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(33, 150, 243, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        right: '-15%',
        width: '700px',
        height: '700px',
        background: 'radial-gradient(circle, rgba(33, 150, 243, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Left side - Branding Content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 60px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '480px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
            lineHeight: '1.2'
          }}>
            Shift Manager
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}>
            Streamline your workforce management with powerful scheduling, 
            request handling, and real-time notifications.
          </p>
          <div style={{
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Features
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <li style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#2196f3',
                  flexShrink: 0
                }} />
                Smart shift scheduling & management
              </li>
              <li style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#2196f3',
                  flexShrink: 0
                }} />
                Real-time request approvals
              </li>
              <li style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#2196f3',
                  flexShrink: 0
                }} />
                Analytics & performance insights
              </li>
              <li style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#2196f3',
                  flexShrink: 0
                }} />
                Multi-role access control
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div style={{
        background: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 60px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '440px', width: '100%' }}>
          <div className="login-header">
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', marginTop: '8px' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo Accounts Section */}
          <div className="demo-users">
            <h4>Demo Accounts</h4>
            <p style={{ 
              marginBottom: '16px', 
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}>
              Click any account below to auto-fill credentials
            </p>

            {credentials.length === 0 ? (
              <div className="loading" style={{ padding: '40px 20px' }}>
                Loading demo accounts...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {credentials.map((cred) => (
                  <button
                    key={cred._id}
                    type="button"
                    className="btn btn-secondary btn-small"
                    onClick={() => fillDemo(cred.username, cred.password)}
                    disabled={loading}
                    style={{ 
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ 
                      fontWeight: '700',
                      textTransform: 'capitalize'
                    }}>
                      {cred.role}
                    </span>
                    <span style={{ 
                      fontSize: '13px',
                      color: 'var(--text-tertiary)',
                      fontFamily: 'monospace'
                    }}>
                      {cred.username}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login