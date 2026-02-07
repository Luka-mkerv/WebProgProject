const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
{
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Changed from 'Employee' to 'User'
      required: true
    },
    type: {
      type: String,
      enum: ['time_off', 'shift_swap'],
      required: true
    },
    shiftDate: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);
