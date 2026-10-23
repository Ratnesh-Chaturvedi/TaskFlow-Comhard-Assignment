import { TASK_STATUS } from '../constants/status.js';

/**
 * Calculates real-time SLA metrics and dynamic lifecycle durations for a task.
 * @param {Object} task - Mongoose task document or plain object
 * @param {Date} [currentTime] - Injected time provider for deterministic tests
 * @returns {Object} enriched task data with `timeTracking` and `sla`
 */
export const calculateTaskSLA = (task, currentTime = new Date()) => {
  const doc = task.toObject ? task.toObject() : { ...task };
  const now = currentTime.getTime();
  const createdAt = new Date(doc.createdAt || currentTime).getTime();
  const currentStatusSince = new Date(doc.currentStatusSince || createdAt).getTime();

  // 1. Current active interval duration
  let activeIntervalMs = 0;
  if (doc.status === TASK_STATUS.COMPLETED && doc.completedAt) {
    const completedAt = new Date(doc.completedAt).getTime();
    activeIntervalMs = Math.max(0, completedAt - currentStatusSince);
  } else {
    activeIntervalMs = Math.max(0, now - currentStatusSince);
  }

  // 2. Cumulative durations
  let cumulativeCreated = Number(doc.timeInCreated) || 0;
  let cumulativeInProgress = Number(doc.timeInProgress) || 0;
  let cumulativeCompleted = Number(doc.timeInCompleted) || 0;

  if (doc.status === TASK_STATUS.CREATED) {
    cumulativeCreated += activeIntervalMs;
  } else if (doc.status === TASK_STATUS.IN_PROGRESS) {
    cumulativeInProgress += activeIntervalMs;
  } else if (doc.status === TASK_STATUS.COMPLETED) {
    cumulativeCompleted += activeIntervalMs;
  }

  // 3. Total elapsed time from creation
  const totalElapsedMs = doc.completedAt
    ? Math.max(0, new Date(doc.completedAt).getTime() - createdAt)
    : Math.max(0, now - createdAt);

  // Helper formatter
  const formatDuration = (ms) => {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours === 0 && mins === 0) return '< 1m';
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const timeTracking = {
    currentStatusMs: activeIntervalMs,
    currentStatusFormatted: formatDuration(activeIntervalMs),
    totalElapsedMs,
    totalElapsedFormatted: formatDuration(totalElapsedMs),
    timeInCreatedMs: cumulativeCreated,
    timeInCreatedFormatted: formatDuration(cumulativeCreated),
    timeInProgressMs: cumulativeInProgress,
    timeInProgressFormatted: formatDuration(cumulativeInProgress),
    timeInCompletedMs: cumulativeCompleted,
    timeInCompletedFormatted: formatDuration(cumulativeCompleted),
    percentages: {
      created: totalElapsedMs > 0 ? Math.round((cumulativeCreated / totalElapsedMs) * 100) : 0,
      inProgress: totalElapsedMs > 0 ? Math.round((cumulativeInProgress / totalElapsedMs) * 100) : 0,
      completed: totalElapsedMs > 0 ? Math.round((cumulativeCompleted / totalElapsedMs) * 100) : 0
    }
  };

  // 4. SLA Status Calculation
  let sla = {
    enabled: !!doc.slaEnabled,
    status: 'Not Started',
    deadline: doc.slaDeadline ? new Date(doc.slaDeadline) : null,
    remainingMinutes: 0,
    overdueMinutes: 0,
    remainingFormatted: '',
    isAtRisk: false,
    durationMinutes: doc.slaDurationMinutes || 480,
    startType: doc.slaStartType || 'creation'
  };

  if (!doc.slaEnabled) {
    sla.status = 'Disabled';
  } else if (doc.slaStartType === 'first_start' && !doc.startedAt) {
    sla.status = 'Not Started';
    sla.remainingMinutes = doc.slaDurationMinutes || 480;
    sla.remainingFormatted = `${formatDuration(sla.remainingMinutes * 60000)} remaining (starts upon In Progress)`;
  } else {
    // Determine deadline
    let deadlineMs = doc.slaDeadline ? new Date(doc.slaDeadline).getTime() : null;
    if (!deadlineMs) {
      const baseMs = doc.slaStartType === 'first_start' && doc.startedAt
        ? new Date(doc.startedAt).getTime()
        : createdAt;
      deadlineMs = baseMs + (doc.slaDurationMinutes || 480) * 60000;
      sla.deadline = new Date(deadlineMs);
    }

    if (doc.status === TASK_STATUS.COMPLETED && doc.completedAt) {
      const completedTime = new Date(doc.completedAt).getTime();
      if (completedTime <= deadlineMs) {
        sla.status = 'Met';
        sla.completedOnTime = true;
      } else {
        sla.status = 'Completed Late';
        sla.completedOnTime = false;
        sla.overdueMinutes = Math.round((completedTime - deadlineMs) / 60000);
        sla.remainingFormatted = `${formatDuration((completedTime - deadlineMs))} late`;
      }
    } else {
      // Task is active
      const diffMs = deadlineMs - now;
      const totalSlaMs = (doc.slaDurationMinutes || 480) * 60000;
      const thresholdPercent = doc.slaAtRiskThresholdPercent || 20;
      const atRiskMs = (totalSlaMs * thresholdPercent) / 100;

      if (diffMs < 0) {
        sla.status = 'Breached';
        sla.overdueMinutes = Math.round(Math.abs(diffMs) / 60000);
        sla.remainingFormatted = `${formatDuration(Math.abs(diffMs))} overdue`;
      } else if (diffMs <= atRiskMs) {
        sla.status = 'At Risk';
        sla.isAtRisk = true;
        sla.remainingMinutes = Math.round(diffMs / 60000);
        sla.remainingFormatted = `${formatDuration(diffMs)} remaining`;
      } else {
        sla.status = 'On Track';
        sla.remainingMinutes = Math.round(diffMs / 60000);
        sla.remainingFormatted = `${formatDuration(diffMs)} remaining`;
      }
    }
  }

  return {
    ...doc,
    timeTracking,
    sla
  };
};
