const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    position: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Employee'],
      default: 'Employee'
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    color: {
      type: String,
      required: true,
      default: '#667eea'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);