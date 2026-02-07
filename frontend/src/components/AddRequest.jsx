import { useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

function AddRequest({ user, onClose, onAdd }) {
  const [type, setType] = useState('time_off')
  const [shiftDate, setShiftDate] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!shiftDate || !reason) {
      setError('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      const payload = {
        employeeId: user._id, 
        type,
        shiftDate,
        reason,
        status: 'pending'
      }

      await axios.post(`${API_URL}/requests`, payload)
      onAdd() // Refresh list in parent
      onClose() // Close modal
    } catch (err) {
      console.error(err)
      setError('Failed to create request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>New Request</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="time_off">Time Off</option>
              <option value="shift_swap">Shift Swap</option>
            </select>
          </div>

          <div className="form-group">
            <label>Shift Date</label>
            <input
              type="date"
              value={shiftDate}
              onChange={(e) => setShiftDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddRequest
