import { useState, useEffect } from 'react'
import axios from 'axios'
import AddRequest from './AddRequest'

const API_URL = 'http://localhost:5000/api'

function RequestList({ user }) {
  const [requests, setRequests] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchRequests()
    fetchEmployees()
    
    // Poll for new requests every 10 seconds
    const interval = setInterval(fetchRequests, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/requests`)
      setRequests(response.data)
    } catch (err) {
      console.error('Error fetching requests:', err)
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

  const handleApprove = async (id) => {
    try {
      await axios.patch(`${API_URL}/requests/${id}`, { status: 'approved' })
      fetchRequests()
    } catch {
      alert('Failed to approve request')
    }
  }

  const handleReject = async (id) => {
    try {
      await axios.patch(`${API_URL}/requests/${id}`, { status: 'rejected' })
      fetchRequests()
    } catch {
      alert('Failed to reject request')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await axios.delete(`${API_URL}/requests/${id}`)
        fetchRequests()
      } catch {
        alert('Failed to delete request')
      }
    }
  }

  const getEmployeeName = (employeeId) => {
    // Handle both object and string IDs
    if (typeof employeeId === 'object' && employeeId?.name) {
      return employeeId.name
    }
    const employee = employees.find(e => e._id === employeeId)
    return employee ? employee.name : 'Unknown'
  }

  const getStatusClass = (status) => `request-status status-${status}`

  const filteredRequests =
    user.role === 'Employee'
      ? requests.filter(req => {
          // Handle both populated object and string ID
          const empId = typeof req.employeeId === 'string' ? req.employeeId : req.employeeId?._id
          return empId === user._id
        })
      : requests

  if (loading) return <div className="loading">Loading requests...</div>

  return (
    <div>
      <div className="section-header">
       
        {user.role === 'Employee' && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + New Request
          </button>
        )}
      </div>

      {filteredRequests.length === 0 ? (
        <div className="empty-state">No requests found.</div>
      ) : (
        <div>
          {filteredRequests.map(request => (
            <div key={request._id} className="shift-card" style={{ marginBottom: '15px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '10px'
                }}
              >
                <div>
                  <div className="card-header">{getEmployeeName(request.employeeId)}</div>
                  <div className="card-info">
                    {request.type.replace('_', ' ').toUpperCase()} - {request.shiftDate}
                  </div>
                </div>
                <span className={getStatusClass(request.status)}>
                  {request.status.toUpperCase()}
                </span>
              </div>

              <div className="card-info" style={{ marginTop: '10px' }}>
                {request.reason}
              </div>

              <div className="card-actions">
                {user.role === 'Employee' ? (
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => handleDelete(request._id)}
                  >
                    Delete
                  </button>
                ) : (
                  request.status === 'pending' && (
                    <>
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => handleApprove(request._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleReject(request._id)}
                      >
                        Reject
                      </button>
                    </>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddRequest
          user={user}
          onClose={() => setShowAddModal(false)}
          onAdd={fetchRequests}
        />
      )}
    </div>
  )
}

export default RequestList
