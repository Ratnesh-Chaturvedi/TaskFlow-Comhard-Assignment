import Task from '../models/Task.js';
import TaskActivity from '../models/TaskActivity.js';
import { TASK_STATUS } from '../constants/status.js';
import { logActivity } from './activity.service.js';
import { calculateTaskSLA } from '../utils/slaCalculator.js';

export const createTask = async (userId, data) => {
  const now = new Date();
  const taskData = {
    ...data,
    user: userId,
    currentStatusSince: now,
    timeInCreated: 0,
    timeInProgress: 0,
    timeInCompleted: 0
  };

  const status = taskData.status || TASK_STATUS.CREATED;
  const slaDurationMinutes = Number(taskData.slaDurationMinutes) || 480;
  const slaStartType = taskData.slaStartType || 'creation';
  const slaEnabled = taskData.slaEnabled !== false;

  if (status === TASK_STATUS.IN_PROGRESS) {
    taskData.startedAt = now;
  }
  if (status === TASK_STATUS.COMPLETED) {
    taskData.completedAt = now;
  }

  // Calculate initial SLA deadline
  if (slaEnabled) {
    if (slaStartType === 'creation') {
      taskData.slaDeadline = new Date(now.getTime() + slaDurationMinutes * 60000);
    } else if (slaStartType === 'first_start' && status === TASK_STATUS.IN_PROGRESS) {
      taskData.slaDeadline = new Date(now.getTime() + slaDurationMinutes * 60000);
    } else {
      taskData.slaDeadline = null; // Will start upon entering In Progress
    }
  }

  // Record initial status history entry
  taskData.statusHistory = [
    {
      fromStatus: '',
      toStatus: status,
      transitionAt: now,
      durationSeconds: 0,
      user: userId
    }
  ];

  const task = await Task.create(taskData);

  await logActivity({
    taskId: task._id,
    userId,
    action: 'created',
    description: `Task created with status "${task.status}" and priority "${task.priority}" (SLA: ${slaDurationMinutes}m)`
  });

  return calculateTaskSLA(task);
};

export const getTasks = async (userId, query = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    search,
    startDate,
    endDate,
    tag,
    slaStatus,
    sortBy = 'createdAt',
    order = 'desc'
  } = query;

  const filter = { user: userId };

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (tag) {
    filter.tags = tag;
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex }
    ];
  }

  if (startDate || endDate) {
    filter.dueDate = {};
    if (startDate) filter.dueDate.$gte = new Date(startDate);
    if (endDate) filter.dueDate.$lte = new Date(endDate);
  }

  // Handle SLA sorting or custom sorting
  const sortOrder = order === 'asc' ? 1 : -1;
  const sort = { [sortBy]: sortOrder };

  const rawTasks = await Task.find(filter).sort(sort);

  // Decorate with real-time SLA metrics
  let calculatedTasks = rawTasks.map((t) => calculateTaskSLA(t));

  // SLA Status filtering
  if (slaStatus) {
    calculatedTasks = calculatedTasks.filter((t) => t.sla?.status === slaStatus);
  }

  // Custom in-memory sort if by dynamic SLA fields
  if (sortBy === 'slaDeadline') {
    calculatedTasks.sort((a, b) => {
      const da = a.sla?.deadline ? new Date(a.sla.deadline).getTime() : 0;
      const db = b.sla?.deadline ? new Date(b.sla.deadline).getTime() : 0;
      return order === 'asc' ? da - db : db - da;
    });
  } else if (sortBy === 'currentStatusDuration') {
    calculatedTasks.sort((a, b) => {
      const da = a.timeTracking?.currentStatusMs || 0;
      const db = b.timeTracking?.currentStatusMs || 0;
      return order === 'asc' ? da - db : db - da;
    });
  } else if (sortBy === 'totalElapsedTime') {
    calculatedTasks.sort((a, b) => {
      const da = a.timeTracking?.totalElapsedMs || 0;
      const db = b.timeTracking?.totalElapsedMs || 0;
      return order === 'asc' ? da - db : db - da;
    });
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const total = calculatedTasks.length;
  const skip = (pageNum - 1) * limitNum;
  const paginatedTasks = calculatedTasks.slice(skip, skip + limitNum);

  return {
    tasks: paginatedTasks,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1
    }
  };
};

export const getTaskById = async (userId, taskId) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  return calculateTaskSLA(task);
};

export const updateTask = async (userId, taskId, updates) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  const now = new Date();
  const changes = [];

  // Check if status changed
  if (updates.status && updates.status !== task.status) {
    const oldStatus = task.status;
    const newStatus = updates.status;
    const intervalMs = Math.max(0, now.getTime() - new Date(task.currentStatusSince || task.createdAt).getTime());

    if (oldStatus === TASK_STATUS.CREATED) {
      task.timeInCreated = (task.timeInCreated || 0) + intervalMs;
    } else if (oldStatus === TASK_STATUS.IN_PROGRESS) {
      task.timeInProgress = (task.timeInProgress || 0) + intervalMs;
    } else if (oldStatus === TASK_STATUS.COMPLETED) {
      task.timeInCompleted = (task.timeInCompleted || 0) + intervalMs;
    }

    task.statusHistory.push({
      fromStatus: oldStatus,
      toStatus: newStatus,
      transitionAt: now,
      durationSeconds: Math.round(intervalMs / 1000),
      user: userId
    });

    if (newStatus === TASK_STATUS.IN_PROGRESS) {
      if (!task.startedAt) task.startedAt = now;
      if (task.slaEnabled && task.slaStartType === 'first_start' && !task.slaDeadline) {
        task.slaDeadline = new Date(now.getTime() + (task.slaDurationMinutes || 480) * 60000);
      }
    }

    if (newStatus === TASK_STATUS.COMPLETED) {
      task.completedAt = now;
    } else if (oldStatus === TASK_STATUS.COMPLETED) {
      task.completedAt = null; // Reopened
    }

    task.status = newStatus;
    task.currentStatusSince = now;

    changes.push({
      action: 'status_changed',
      field: 'status',
      oldValue: oldStatus,
      newValue: newStatus,
      description: `Status changed from "${oldStatus}" to "${newStatus}"`
    });
  }

  // Check SLA configuration updates
  if (
    updates.slaDurationMinutes !== undefined ||
    updates.slaStartType !== undefined ||
    updates.slaEnabled !== undefined
  ) {
    const newDuration = updates.slaDurationMinutes !== undefined ? Number(updates.slaDurationMinutes) : task.slaDurationMinutes;
    const newStartType = updates.slaStartType !== undefined ? updates.slaStartType : task.slaStartType;
    const newEnabled = updates.slaEnabled !== undefined ? updates.slaEnabled : task.slaEnabled;

    task.slaDurationMinutes = newDuration;
    task.slaStartType = newStartType;
    task.slaEnabled = newEnabled;

    if (newEnabled) {
      if (newStartType === 'creation') {
        task.slaDeadline = new Date(new Date(task.createdAt).getTime() + newDuration * 60000);
      } else if (newStartType === 'first_start') {
        task.slaDeadline = task.startedAt
          ? new Date(new Date(task.startedAt).getTime() + newDuration * 60000)
          : null;
      }
    } else {
      task.slaDeadline = null;
    }
  }

  // Update remaining general fields
  const regularFields = ['title', 'description', 'priority', 'startDate', 'dueDate', 'tags', 'category'];
  for (const f of regularFields) {
    if (updates[f] !== undefined) {
      task[f] = updates[f];
    }
  }

  await task.save();

  for (const change of changes) {
    await logActivity({
      taskId: task._id,
      userId,
      ...change
    });
  }

  return calculateTaskSLA(task);
};

export const updateTaskStatus = async (userId, taskId, newStatus) => {
  return updateTask(userId, taskId, { status: newStatus });
};

export const deleteTask = async (userId, taskId) => {
  const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  await TaskActivity.deleteMany({ task: taskId });
  return task;
};

export const getTaskActivities = async (userId, taskId) => {
  await Task.findOne({ _id: taskId, user: userId });
  return TaskActivity.find({ task: taskId }).sort({ createdAt: -1 });
};
