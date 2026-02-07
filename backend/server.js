const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import models
const User = require('./models/User');
const Employee = require('./models/Employee');
const Shift = require('./models/Shift');
const Request = require('./models/Request');
const Notification = require('./models/Notification');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// API Routes

// Get all credentials for login page display
app.get('/api/credentials', async (req, res) => {
  try {
    const users = await User.find().select('username password role name');
    res.json(users);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    
    if (user) {
      const { password, ...userWithoutPassword } = user.toObject();
      res.json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add new employee (creates both Employee and User)
app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, position, role, username, password, color } = req.body;
    
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    
    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    
    // Create User account
    const newUser = new User({
      username,
      password,
      name,
      role: role || 'Employee'
    });
    const savedUser = await newUser.save();
    
    // Create Employee record
    const newEmployee = new Employee({
      name,
      email,
      position,
      role: role || 'Employee',
      username,
      password,
      color: color || '#667eea',
      userId: savedUser._id
    });
    const savedEmployee = await newEmployee.save();
    
    res.status(201).json(savedEmployee);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete employee (also deletes User account)
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findById(id);
    
    if (employee && employee.userId) {
      // Delete associated User account
      await User.findByIdAndDelete(employee.userId);
    }
    
    // Delete employee
    await Employee.findByIdAndDelete(id);
    
    // Delete all shifts for this employee
    await Shift.deleteMany({ employeeId: id });
    
    res.json({ success: true, message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all shifts
app.get('/api/shifts', async (req, res) => {
  try {
    const shifts = await Shift.find().populate('employeeId');
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add new shift
app.post('/api/shifts', async (req, res) => {
  try {
    const newShift = new Shift(req.body);
    const savedShift = await newShift.save();
    await savedShift.populate('employeeId');
    
    // Create notification for assigned employee
    const empId = typeof savedShift.employeeId === 'string' ? savedShift.employeeId : savedShift.employeeId?._id;
    const employee = await Employee.findById(empId);
    if (employee && employee.userId) {
      const message = `New shift assigned to you on ${savedShift.date}`;
      await createNotification(employee.userId, message, 'shift', savedShift._id, 'shift');
    }
    
    res.status(201).json(savedShift);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update shift
app.put('/api/shifts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedShift = await Shift.findByIdAndUpdate(id, req.body, { new: true }).populate('employeeId');
    
    if (updatedShift) {
      res.json(updatedShift);
    } else {
      res.status(404).json({ success: false, message: 'Shift not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete shift
app.delete('/api/shifts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Shift.findByIdAndDelete(id);
    res.json({ success: true, message: 'Shift deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all requests
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await Request.find().populate('employeeId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add new request
app.post('/api/requests', async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    const savedRequest = await newRequest.save();
    await savedRequest.populate('employeeId');
    
    // Create notification for the request
    const empId = typeof savedRequest.employeeId === 'string' ? savedRequest.employeeId : savedRequest.employeeId?._id;
    const employee = await Employee.findById(empId);
    if (employee && employee.userId) {
      const message = `${savedRequest.type === 'time_off' ? 'Time off' : 'Leave'} requested for ${savedRequest.date}`;
      await createNotification(employee.userId, message, 'request', savedRequest._id, 'request');
    }
    
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update request status (approve/reject)
app.patch('/api/requests/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedRequest = await Request.findByIdAndUpdate(id, req.body, { new: true }).populate('employeeId');
    
    if (updatedRequest) {
      // Create notification when request is approved or rejected
      const empId = typeof updatedRequest.employeeId === 'string' ? updatedRequest.employeeId : updatedRequest.employeeId?._id;
      const employee = await Employee.findById(empId);
      if (employee && employee.userId) {
        const statusMessage = updatedRequest.status === 'approved' ? '✅ approved' : '❌ rejected';
        const message = `Your request was ${statusMessage}!`;
        await createNotification(employee.userId, message, 'approval', updatedRequest._id, 'request');
      }
      
      res.json(updatedRequest);
    } else {
      res.status(404).json({ success: false, message: 'Request not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete request
app.delete('/api/requests/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Request.findByIdAndDelete(id);
    res.json({ success: true, message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ========== NOTIFICATION ENDPOINTS ==========

// Get notifications for current user
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get unread notification count
app.get('/api/notifications/:userId/unread-count', async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Notification.countDocuments({ userId, read: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Mark all notifications as read
app.put('/api/notifications/:userId/read-all', async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany({ userId }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete notification
app.delete('/api/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper function to create notification
async function createNotification(userId, message, type = 'general', relatedId = null, relatedType = null) {
  try {
    const notification = new Notification({
      userId,
      message,
      type,
      relatedId,
      relatedType,
    });
    await notification.save();
  } catch (err) {
    console.error('Error creating notification:', err);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});