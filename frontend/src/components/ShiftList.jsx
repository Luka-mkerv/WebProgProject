import { useState, useEffect } from 'react'
import axios from 'axios'
import AddShift from './AddShift'

const API_URL = 'http://localhost:5000/api'

function ShiftList({ user }) {
  const [shifts, setShifts] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchShifts()
    fetchEmployees()
  }, [])

  const fetchShifts = async () => {
    try {
      const response = await axios.get(`${API_URL}/shifts`)
      setShifts(response.data)
    } catch (err) {
      console.error('Error fetching shifts:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees`)
      setEmployees(response.data)
    } catch (err) {
      console.error('Error fetching employees:', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      try {
        await axios.delete(`${API_URL}/shifts/${id}`)
        fetchShifts()
      } catch (err) {
        alert('Failed to delete shift')
      }
    }
  }

  const handleAddShift = () => {
    fetchShifts()
    setShowAddModal(false)
  }

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId)
    return employee ? employee.name : 'Unknown'
  }

  if (loading) {
    return <div className="loading">Loading shifts...</div>
  }

  return (
    <div>
      <div className="section-header">
        <h2>Shift Management</h2>
        {user.role !== 'Employee' && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Shift
          </button>
        )}
      </div>

      {shifts.length === 0 ? (
        <div className="empty-state">No shifts scheduled yet.</div>
      ) : (
        <div className="shift-list">
          {shifts.map(shift => (
            <div key={shift.id} className="shift-card">
              <div className="card-header">{getEmployeeName(shift.employeeId)}</div>
              <div className="card-info">📅 {shift.date}</div>
              <div className="card-info">🕐 {shift.startTime} - {shift.endTime}</div>
              <div className="card-info">💼 {shift.position}</div>
              
              {user.role !== 'Employee' && (
                <div className="card-actions">
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(shift.id)}
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
        <AddShift
          employees={employees}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddShift}
        />
      )}
    </div>
  )
}

export default ShiftList