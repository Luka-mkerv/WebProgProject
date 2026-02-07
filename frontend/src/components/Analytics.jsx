import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const API_URL = 'http://localhost:5000/api';
const COLORS = [
  '#00d4ff', '#0099ff', '#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#ff6b6b',
  '#ffa502', '#ff6b9d', '#a6c0fe', '#f68084', '#55d6be', '#ffa8a8', '#82cd47', '#ffd89b'
];

function Analytics() {
  const [hoursData, setHoursData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [requestData, setRequestData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    
    // Poll for analytics data updates every 15 seconds
    const interval = setInterval(fetchAnalyticsData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const shiftsRes = await axios.get(`${API_URL}/shifts`);
      const employeesRes = await axios.get(`${API_URL}/employees`);
      const requestsRes = await axios.get(`${API_URL}/requests`);

      const shifts = shiftsRes.data;
      const employees = employeesRes.data;
      const requests = requestsRes.data;

      // Calculate total hours per employee
      const hoursMap = {};
      employees.forEach(emp => {
        hoursMap[emp._id] = { name: emp.name, hours: 0 };
      });

      shifts.forEach(shift => {
        const empId = typeof shift.employeeId === 'string' ? shift.employeeId : shift.employeeId?._id;
        if (hoursMap[empId]) {
          const start = new Date(`${shift.date}T${shift.startTime}`);
          const end = new Date(`${shift.date}T${shift.endTime}`);
          const diffMs = end - start;
          const diffHours = diffMs / (1000 * 60 * 60);
          hoursMap[empId].hours += diffHours;
        }
      });

      const hoursChartData = Object.values(hoursMap)
        .filter(item => item.hours > 0)
        .sort((a, b) => b.hours - a.hours);
      setHoursData(hoursChartData);

      // Calculate shift distribution by position
      const positionMap = {};
      shifts.forEach(shift => {
        const pos = shift.position || 'Unknown';
        positionMap[pos] = (positionMap[pos] || 0) + 1;
      });

      const positionChartData = Object.entries(positionMap).map(([name, value]) => ({
        name,
        value,
      }));
      setPositionData(positionChartData);

      // Calculate busiest days of the week
      const daysMap = {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
      };

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      shifts.forEach(shift => {
        const date = new Date(`${shift.date}T${shift.startTime}`);
        const dayName = dayNames[date.getDay()];
        daysMap[dayName]++;
      });

      const weekChartData = dayNames.map(day => ({
        day: day.substring(0, 3),
        shifts: daysMap[day],
      }));
      setWeekData(weekChartData);

      // Calculate request approval rates
      const totalRequests = requests.length;
      const approvedRequests = requests.filter(r => r.status === 'approved').length;
      const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
      const pendingRequests = requests.filter(r => r.status === 'pending').length;

      setRequestData({
        total: totalRequests,
        approved: approvedRequests,
        approvalRate: totalRequests > 0 ? Math.round((approvedRequests / totalRequests) * 100) : 0,
        rejected: rejectedRequests,
        pending: pendingRequests,
      });
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics-container">
      <h2>Analytics & Reports</h2>

      {/* Request Approval Rates */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Request Approval Rate</h3>
          <div className="approval-rate">{requestData.approvalRate}%</div>
          <div className="metric-details" style={{display:'flex',gap:12,alignItems:'center'}}>
            <span style={{display:'inline-flex',alignItems:'center',gap:8}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Approved: {requestData.approved}
            </span>

            <span style={{display:'inline-flex',alignItems:'center',gap:8}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Rejected: {requestData.rejected}
            </span>

            <span style={{display:'inline-flex',alignItems:'center',gap:8}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8v5l3 3" stroke="#f39c12" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" stroke="#f1c40f" fill="#fff"/></svg>
              Pending: {requestData.pending}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Total Hours per Employee */}
        <div className="chart-container">
          <h3>Total Hours Worked Per Employee</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ebf0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e8ebf0',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="hours" fill="#00d4ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Shift Distribution by Position */}
        <div className="chart-container">
          <h3>Shift Distribution by Position</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={positionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {positionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e8ebf0',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Busiest Days of the Week */}
        <div className="chart-container full-width">
          <h3>Busiest Days of the Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ebf0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e8ebf0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="shifts"
                stroke="#00d4ff"
                strokeWidth={3}
                dot={{ fill: '#0099ff', r: 5 }}
                activeDot={{ r: 7 }}
                name="Number of Shifts"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
