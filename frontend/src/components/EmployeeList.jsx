import { useState, useEffect } from 'react'
import axios from 'axios'
import AddEmployee from './AddEmployee'

const API_URL = 'http://localhost:5000/api'

function EmployeeList({ user }) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees`)
      setEmployees(response.data)
    } catch (err) {
      console.error('Error fetching employees:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee? This will also delete their login account.')) {
      try {
        await axios.delete(`${API_URL}/employees/${id}`)
        fetchEmployees()
      } catch (err) {
        alert('Failed to delete employee')
      }
    }
  }

  if (loading) {
    return <div className="loading">Loading employees...</div>
  }

  return (
    <div>
      <div className="section-header">
        
        {user.role === 'Admin' && (
          <button 
            className="btn btn-primary" 
            onClick={() => setShowAddModal(true)}
          >
            + Add Employee
          </button>
        )}
      </div>

      {employees.length === 0 ? (
        <div className="empty-state">No employees found.</div>
      ) : (
        <div className="shift-list">
          {employees.map(employee => (
            <div key={employee._id} className="shift-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: employee.color,
                    border: '2px solid #e0e0e0',
                    flexShrink: 0
                  }}
                  title="Calendar color"
                />
                <div className="card-header" style={{ margin: 0 }}>{employee.name}</div>
              </div>
              <div className="card-info" style={{display:'flex',alignItems:'center',gap:8}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" fill="#fff" stroke="#cbd5e1"/><path d="M4 6l8 7 8-7" stroke="#0066ff" strokeWidth="1.2" fill="none"/></svg>
                <span>{employee.email}</span>
              </div>

              <div className="card-info" style={{display:'flex',alignItems:'center',gap:8}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V7z" stroke="#cbd5e1" fill="#fff"/><path d="M9 7V5a3 3 0 116 0v2" stroke="#0066ff"/></svg>
                <span>{employee.position}</span>
              </div>

              <div className="card-info" style={{display:'flex',alignItems:'center',gap:8}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3" fill="#0066ff"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="#cbd5e1" strokeWidth="1.2" fill="none"/></svg>
                <span>{employee.role}</span>
              </div>

              <div className="card-info" style={{display:'flex',alignItems:'center',gap:8}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 17a2 2 0 100-4 2 2 0 000 4z" fill="#fff"/><path d="M6 11V9a6 6 0 1112 0v2" stroke="#00d4ff" strokeWidth="1.2"/></svg>
                <span>Username: <strong>{employee.username}</strong></span>
              </div>
              
              {user.role === 'Admin' && (
                <div className="card-actions">
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(employee._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddEmployee
          onClose={() => setShowAddModal(false)}
          onAdd={fetchEmployees}
        />
      )}
    </div>
  )
}

export default EmployeeList