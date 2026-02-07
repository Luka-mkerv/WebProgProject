const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['shift', 'request', 'approval', 'general'],
      default: 'general',
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      description: 'ID of the related shift, request, or other entity',
    },
    relatedType: {
      type: String,
      enum: ['shift', 'request', null],
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
