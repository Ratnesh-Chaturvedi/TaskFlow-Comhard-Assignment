import mongoose from 'mongoose';
import { TASK_STATUS, TASK_PRIORITY, STATUS_LIST, PRIORITY_LIST } from '../constants/status.js';

const statusHistorySchema = new mongoose.Schema(
  {
    fromStatus: {
      type: String,
      default: ''
    },
    toStatus: {
      type: String,
      required: true
    },
    transitionAt: {
      type: Date,
      default: Date.now
    },
    durationSeconds: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: STATUS_LIST,
      default: TASK_STATUS.CREATED,
      index: true
    },
    priority: {
      type: String,
      enum: PRIORITY_LIST,
      default: TASK_PRIORITY.MEDIUM,
      index: true
    },
    startDate: {
      type: Date,
      default: null
    },
    dueDate: {
      type: Date,
      default: null,
      index: true
    },
    tags: {
      type: [String],
      default: []
    },
    category: {
      type: String,
      trim: true,
      default: ''
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // --- SLA & Time Tracking Fields ---
    startedAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    },
    currentStatusSince: {
      type: Date,
      default: Date.now
    },
    timeInCreated: {
      type: Number,
      default: 0
    },
    timeInProgress: {
      type: Number,
      default: 0
    },
    timeInCompleted: {
      type: Number,
      default: 0
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: []
    },
    slaEnabled: {
      type: Boolean,
      default: true
    },
    slaDurationMinutes: {
      type: Number,
      default: 480 // 8 hours default
    },
    slaStartType: {
      type: String,
      enum: ['creation', 'first_start'],
      default: 'creation'
    },
    slaDeadline: {
      type: Date,
      default: null,
      index: true
    },
    slaAtRiskThresholdPercent: {
      type: Number,
      default: 20
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, slaDeadline: 1 });
taskSchema.index({ user: 1, createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;
