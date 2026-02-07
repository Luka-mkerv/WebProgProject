import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import AddShift from './AddShift'

const API_URL = 'http://localhost:5000/api'

function ShiftList({ user }) {
  const [shifts, setShifts] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEmployee, setFilterEmployee] = useState('all')

  // key: 'YYYY-MM-DD' -> boolean (expanded/collapsed)
  const [openDays, setOpenDays] = useState({})

  useEffect(() => {
    fetchShifts()
    fetchEmployees()
    const interval = setInterval(fetchShifts, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchShifts = async () => {
    try {
      const res = await axios.get(`${API_URL}/shifts`)
      setShifts(res.data)
    } catch (err) {
      console.error('Error fetching shifts:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees`)
      setEmployees(res.data)
    } catch (err) {
      console.error('Error fetching employees:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shift?')) return
    try {
      await axios.delete(`${API_URL}/shifts/${id}`)
      fetchShifts()
    } catch (err) {
      alert('Failed to delete shift')
    }
  }

  const getEmployee = (employeeId) => {
    if (typeof employeeId === 'object' && employeeId?.name) return employeeId
    return employees.find(e => e._id === employeeId) || {
      name: 'Unknown',
      color: '#cbd5e1'
    }
  }

  // ✅ Use UTC-safe date key (no timezone drift)
  const getDateKey = (dateValue) => {
    if (!dateValue) return '0000-00-00'

    // If backend sends ISO string: "2026-02-03T00:00:00.000Z"
    if (typeof dateValue === 'string' && dateValue.length >= 10) {
      return dateValue.slice(0, 10) // YYYY-MM-DD
    }

    // Fallback for Date objects
    const d = new Date(dateValue)
    // Normalize to UTC key
    const yyyy = d.getUTCFullYear()
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(d.getUTCDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  // ✅ Format using UTC so header & row match
  const formatDayTitle = (key) => {
    const d = new Date(`${key}T00:00:00.000Z`)
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    })
  }

  const formatRowDate = (dateValue) => {
    const key = getDateKey(dateValue)
    const d = new Date(`${key}T00:00:00.000Z`)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    })
  }

  const filteredShifts = useMemo(() => {
    return shifts.filter(shift => {
      const emp = getEmployee(shift.employeeId)

      const matchesEmployee =
        filterEmployee === 'all' || emp._id === filterEmployee

      const matchesSearch =
        !searchTerm ||
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shift.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (shift.date || '').includes(searchTerm)

      return matchesEmployee && matchesSearch
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shifts, employees, searchTerm, filterEmployee])

  // ✅ Group by date key "YYYY-MM-DD" (UTC-safe)
  const groups = useMemo(() => {
    const map = new Map()

    for (const shift of filteredShifts) {
      const key = getDateKey(shift.date)
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(shift)
    }

    // Sort days asc (UTC)
    const days = Array.from(map.keys()).sort(
      (a, b) => new Date(`${a}T00:00:00.000Z`) - new Date(`${b}T00:00:00.000Z`)
    )

    // Sort shifts inside each day by startTime
    return days.map(key => {
      const items = map.get(key)
      items.sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
      return { key, items }
    })
  }, [filteredShifts])

  // Auto-open all days when filters change
  useEffect(() => {
    const next = {}
    for (const g of groups) next[g.key] = true
    setOpenDays(next)
  }, [searchTerm, filterEmployee, groups.length])

  const toggleDay = (key) => {
    setOpenDays(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (loading) return <div className="loading">Loading shifts...</div>

  return (
    <div>
      {/* HEADER */}
      <div className="section-header">
        {user.role !== 'Employee' && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Shift
          </button>
        )}
      </div>

      {/* FILTER BAR */}
      <div
        style={{
          background: 'var(--surface)',
          padding: 'var(--space-5)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--space-6)',
          border: '1px solid var(--border)',
          display: 'flex',
          gap: 'var(--space-4)',
          alignItems: 'center',
          flexWrap: 'wrap',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {/* Search */}
        <div style={{ flex: '1', minWidth: '240px' }}>
          <div style={{ position: 'relative' }}>
            <svg
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="11" cy="11" r="8" stroke="#94a3b8" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            </svg>

            <input
              className="control"
              type="text"
              placeholder="Search shifts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>

        {/* Employee Filter */}
        <div style={{ minWidth: '220px' }}>
          <select
            className="control"
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
          >
            <option value="all">All Employees</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>{emp.name}</option>
            ))}
          </select>
        </div>

        {/* Clear */}
        {(searchTerm || filterEmployee !== 'all') && (
          <button
            className="btn btn-secondary btn-small"
            onClick={() => {
              setSearchTerm('')
              setFilterEmployee('all')
            }}
          >
            Clear
          </button>
        )}

        {/* Count */}
        <div style={{
          fontSize: '13px',
          color: 'var(--text-tertiary)',
          fontWeight: '600',
          marginLeft: 'auto'
        }}>
          {filteredShifts.length} {filteredShifts.length === 1 ? 'shift' : 'shifts'}
        </div>
      </div>

      {/* EMPTY */}
      {groups.length === 0 ? (
        <div className="empty-state">
          {searchTerm || filterEmployee !== 'all'
            ? 'No shifts match your filters.'
            : 'No shifts scheduled yet.'}
        </div>
      ) : (
        <div className="day-groups">
          {groups.map(({ key, items }) => {
            const isOpen = openDays[key] ?? true

            return (
              <div className="day-card" key={key}>
                {/* Day header */}
                <button
                  type="button"
                  className="day-header"
                  onClick={() => toggleDay(key)}
                >
                  <div className="day-header-left">
                    <span className={`chev ${isOpen ? 'open' : ''}`}>▸</span>
                    <div className="day-title">{formatDayTitle(key)}</div>
                    <div className="day-count">{items.length} shifts</div>
                  </div>

                  <div className="day-header-right">
                    <span className="day-pill">
                      {isOpen ? 'Hide' : 'Show'}
                    </span>
                  </div>
                </button>

                {/* Sliding content */}
                <div className={`day-content ${isOpen ? 'open' : ''}`}>
                  <div className="shift-table">
                    <div className="shift-table-head">
                      <div>Employee</div>
                      <div>Date</div>
                      <div>Time</div>
                      <div>Position</div>
                      {user.role !== 'Employee' && <div className="right">Actions</div>}
                    </div>

                    {items.map((shift) => {
                      const emp = getEmployee(shift.employeeId)

                      return (
                        <div
                          key={shift._id}
                          className="shift-row"
                          style={{ borderLeftColor: emp.color || '#cbd5e1' }}
                        >
                          {/* Employee */}
                          <div className="shift-employee">
                            <div
                              className="shift-avatar"
                              style={{ backgroundColor: emp.color || '#cbd5e1' }}
                            >
                              {emp.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="shift-employee-name">{emp.name}</div>
                          </div>

                          {/* Date (UTC-safe) */}
                          <div className="shift-cell">
                            {formatRowDate(shift.date)}
                          </div>

                          {/* Time */}
                          <div className="shift-cell">
                            <span className="shift-time-pill">
                              {shift.startTime} – {shift.endTime}
                            </span>
                          </div>

                          {/* Position */}
                          <div className="shift-cell">
                            <span className="shift-position-pill">{shift.position}</span>
                          </div>

                          {/* Actions */}
                          {user.role !== 'Employee' && (
                            <div className="shift-cell right">
                              <button
                                className="btn btn-danger btn-small"
                                onClick={() => handleDelete(shift._id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAddModal && (
        <AddShift
          employees={employees}
          onClose={() => setShowAddModal(false)}
          onAdd={() => {
            fetchShifts()
            setShowAddModal(false)
          }}
        />
      )}
    </div>
  )
}

export default ShiftList
