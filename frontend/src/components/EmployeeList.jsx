import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function EmployeeList({ user }) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

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
    if (window.confirm('Are you sure you want to delete this employee?')) {
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
        <h2>Employee Management</h2>
      </div>

      {employees.length === 0 ? (
        <div className="empty-state">No employees found.</div>
      ) : (
        <div className="shift-list">
          {employees.map(employee => (
            <div key={employee.id} className="shift-card">
              <div className="card-header">{employee.name}</div>
              <div className="card-info">📧 {employee.email}</div>
              <div className="card-info">💼 {employee.position}</div>
              <div className="card-info">👤 {employee.role}</div>
              
              {user.role === 'Admin' && (
                <div className="card-actions">
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EmployeeList