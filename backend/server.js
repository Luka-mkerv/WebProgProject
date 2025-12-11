const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data storage (simulating a database)
let users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'Admin', name: 'Admin User' },
  { id: 2, username: 'manager', password: 'manager123', role: 'Manager', name: 'Manager User' },
  { id: 3, username: 'employee', password: 'employee123', role: 'Employee', name: 'John Doe' }
];

let employees = [
  { id: 1, name: 'John Doe', email: 'john@example.com', position: 'Server', role: 'Employee' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', position: 'Chef', role: 'Employee' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', position: 'Cashier', role: 'Employee' }
];

let shifts = [
  { id: 1, employeeId: 1, date: '2025-12-10', startTime: '09:00', endTime: '17:00', position: 'Server' },
  { id: 2, employeeId: 2, date: '2025-12-11', startTime: '14:00', endTime: '22:00', position: 'Chef' }
];

let requests = [
  { id: 1, employeeId: 1, shiftDate: '2025-12-15', type: 'time_off', reason: 'Doctor appointment', status: 'pending' }
];

// API Routes

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get all employees
app.get('/api/employees', (req, res) => {
  res.json(employees);
});

// Add new employee
app.post('/api/employees', (req, res) => {
  const newEmployee = {
    id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
    ...req.body
  };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// Delete employee
app.delete('/api/employees/:id', (req, res) => {
  const id = parseInt(req.params.id);
  employees = employees.filter(e => e.id !== id);
  shifts = shifts.filter(s => s.employeeId !== id);
  res.json({ success: true, message: 'Employee deleted' });
});

// Get all shifts
app.get('/api/shifts', (req, res) => {
  res.json(shifts);
});

// Add new shift
app.post('/api/shifts', (req, res) => {
  const newShift = {
    id: shifts.length > 0 ? Math.max(...shifts.map(s => s.id)) + 1 : 1,
    ...req.body
  };
  shifts.push(newShift);
  res.status(201).json(newShift);
});

// Update shift
app.put('/api/shifts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = shifts.findIndex(s => s.id === id);
  
  if (index !== -1) {
    shifts[index] = { ...shifts[index], ...req.body };
    res.json(shifts[index]);
  } else {
    res.status(404).json({ success: false, message: 'Shift not found' });
  }
});

// Delete shift
app.delete('/api/shifts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  shifts = shifts.filter(s => s.id !== id);
  res.json({ success: true, message: 'Shift deleted' });
});

// Get all requests
app.get('/api/requests', (req, res) => {
  res.json(requests);
});

// Add new request
app.post('/api/requests', (req, res) => {
  const newRequest = {
    id: requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1,
    status: 'pending',
    ...req.body
  };
  requests.push(newRequest);
  res.status(201).json(newRequest);
});

// Update request status (approve/reject)
app.patch('/api/requests/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const request = requests.find(r => r.id === id);
  
  if (request) {
    request.status = req.body.status;
    res.json(request);
  } else {
    res.status(404).json({ success: false, message: 'Request not found' });
  }
});

// Delete request
app.delete('/api/requests/:id', (req, res) => {
  const id = parseInt(req.params.id);
  requests = requests.filter(r => r.id !== id);
  res.json({ success: true, message: 'Request deleted' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});