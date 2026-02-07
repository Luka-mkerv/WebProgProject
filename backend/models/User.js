const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
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
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Employee'],
      default: 'Employee'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
