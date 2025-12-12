import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>🗓️ Shift Manager</h1>
        <p>React + Express MVP</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        {error && <div className="error">{error}</div>}
      </form>
      
      <div className="demo-users">
        <h4>Demo Credentials:</h4>
        <p><strong>Admin:</strong> admin / admin123</p>
        <p><strong>Manager:</strong> manager / manager123</p>
        <p><strong>Employee:</strong> employee / employee123</p>
      </div>
    </div>
  )
}

export default Login