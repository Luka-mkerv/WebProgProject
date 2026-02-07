import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function AddEmployee({ onClose, onAdd }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [position, setPosition] = useState('')
  const [role, setRole] = useState('Employee')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [color, setColor] = useState('#667eea')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !position || !username || !password) {
      setError('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      await axios.post(`${API_URL}/employees`, {
        name,
        email,
        position,
        role,
        username,
        password,
        color
      })
      onAdd() // Refresh employee list
      onClose() // Close modal
    } catch (err) {
      console.error('Error adding employee:', err)
      setError(err.response?.data?.message || 'Failed to add employee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add New Employee</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g. Server, Cook, Cashier"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Username (for login)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. john_doe"
              required
              disabled={loading}
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password for this employee"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>Calendar Color</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                disabled={loading}
                style={{ width: '60px', height: '40px', cursor: 'pointer', border: 'none', borderRadius: '8px' }}
              />
              <span style={{ color: '#666', fontSize: '14px' }}>
                Shifts will appear in this color on the calendar
              </span>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Employee'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEmployee