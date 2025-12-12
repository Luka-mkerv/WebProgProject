import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function AddShift({ employees, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    employeeId: employees[0]?.id || '',
    date: '',
    startTime: '',
    endTime: '',
    position: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'employeeId' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post(`${API_URL}/shifts`, formData)
      onAdd()
    } catch (err) {
      alert('Failed to add shift')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Shift</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee</label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Shift'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddShift