import { useState, useEffect } from 'react';
import axios from 'axios';
import ShiftList from './ShiftList';
import EmployeeList from './EmployeeList';
import RequestList from './RequestList';
import ShiftCalendar from './ShiftCalendar';

const API_URL = 'http://localhost:5000/api';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('shifts');
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const shiftRes = await axios.get(`${API_URL}/shifts`);
      const empRes = await axios.get(`${API_URL}/employees`);
      setShifts(shiftRes.data);
      setEmployees(empRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🗓️ Shift Management System</h1>
        <div className="user-info">
          <span>{user.name}</span>
          <span className="role-badge">{user.role}</span>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'shifts' ? 'active' : ''}`}
          onClick={() => setActiveTab('shifts')}
        >
          📋 Shifts
        </button>

        {user.role !== 'Employee' && (
          <button
            className={`nav-btn ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            👥 Employees
          </button>
        )}

        <button
          className={`nav-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📬 Requests
        </button>

        <button
          className={`nav-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendar
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'shifts' && <ShiftList user={user} />}
        {activeTab === 'employees' && <EmployeeList user={user} />}
        {activeTab === 'requests' && <RequestList user={user} />}
        {activeTab === 'calendar' && <ShiftCalendar shifts={shifts} employees={employees} />}
      </div>
    </div>
  );
}

export default Dashboard;
