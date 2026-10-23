import TaskActivity from '../models/TaskActivity.js';

export const logActivity = async ({ taskId, userId, action, field = '', oldValue = null, newValue = null, description }) => {
  try {
    return await TaskActivity.create({
      task: taskId,
      user: userId,
      action,
      field,
      oldValue,
      newValue,
      description
    });
  } catch (error) {
    console.error('Failed to log task activity:', error.message);
  }
};
