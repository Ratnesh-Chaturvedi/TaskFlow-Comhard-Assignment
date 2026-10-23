import Task from '../models/Task.js';
import TaskActivity from '../models/TaskActivity.js';
import { TASK_STATUS } from '../constants/status.js';
import { calculateTaskSLA } from '../utils/slaCalculator.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const [allTasks, upcomingTasks, recentTasks] = await Promise.all([
      Task.find({ user: userId }),
      Task.find({
        user: userId,
        status: { $ne: TASK_STATUS.COMPLETED },
        dueDate: { $ne: null }
      })
        .sort({ dueDate: 1 })
        .limit(5),
      Task.find({ user: userId })
        .sort({ updatedAt: -1 })
        .limit(6)
    ]);

    // Calculate real-time SLA and time-tracking metrics for all tasks
    const calculatedAll = allTasks.map((t) => calculateTaskSLA(t, now));

    let totalTasks = calculatedAll.length;
    let createdTasks = 0;
    let inProgressTasks = 0;
    let completedTasks = 0;
    let overdueTasks = 0;

    // SLA Analytics
    let onTrackCount = 0;
    let atRiskCount = 0;
    let breachedCount = 0;
    let metCount = 0;
    let completedLateCount = 0;

    let totalCompletionDurationMs = 0;
    let completedWithDurationCount = 0;

    let totalCreatedDurationMs = 0;
    let totalInProgressDurationMs = 0;
    let totalCompletedDurationMs = 0;

    for (const t of calculatedAll) {
      if (t.status === TASK_STATUS.CREATED) createdTasks++;
      if (t.status === TASK_STATUS.IN_PROGRESS) inProgressTasks++;
      if (t.status === TASK_STATUS.COMPLETED) {
        completedTasks++;
        if (t.completedAt && t.createdAt) {
          totalCompletionDurationMs += new Date(t.completedAt) - new Date(t.createdAt);
          completedWithDurationCount++;
        }
      }

      if (t.status !== TASK_STATUS.COMPLETED && t.dueDate && new Date(t.dueDate) < now) {
        overdueTasks++;
      }

      // SLA states
      const slaState = t.sla?.status;
      if (slaState === 'On Track') onTrackCount++;
      else if (slaState === 'At Risk') atRiskCount++;
      else if (slaState === 'Breached') breachedCount++;
      else if (slaState === 'Met') metCount++;
      else if (slaState === 'Completed Late') completedLateCount++;

      // Cumulative durations
      totalCreatedDurationMs += t.timeTracking?.timeInCreatedMs || 0;
      totalInProgressDurationMs += t.timeTracking?.timeInProgressMs || 0;
      totalCompletedDurationMs += t.timeTracking?.timeInCompletedMs || 0;
    }

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const completedTotalSLA = metCount + completedLateCount;
    const onTimeRatePercent = completedTotalSLA > 0 ? Math.round((metCount / completedTotalSLA) * 100) : 100;
    const averageCompletionHours = completedWithDurationCount > 0
      ? (totalCompletionDurationMs / (completedWithDurationCount * 3600000)).toFixed(1)
      : '0.0';

    const statusDistribution = [
      { name: 'Completed', value: completedTasks, color: '#8b5cf6' },
      { name: 'In Progress', value: inProgressTasks, color: '#38bdf8' },
      { name: 'Created', value: createdTasks, color: '#f59e0b' }
    ];

    const slaDistribution = [
      { name: 'On Track', value: onTrackCount, color: '#10b981' },
      { name: 'At Risk', value: atRiskCount, color: '#f59e0b' },
      { name: 'Breached', value: breachedCount, color: '#ef4444' },
      { name: 'Met', value: metCount, color: '#8b5cf6' },
      { name: 'Completed Late', value: completedLateCount, color: '#ec4899' }
    ];

    const averageTimeByStatus = [
      {
        status: 'Created',
        hours: totalTasks > 0 ? Number((totalCreatedDurationMs / (totalTasks * 3600000)).toFixed(1)) : 0
      },
      {
        status: 'In Progress',
        hours: totalTasks > 0 ? Number((totalInProgressDurationMs / (totalTasks * 3600000)).toFixed(1)) : 0
      },
      {
        status: 'Completed',
        hours: totalTasks > 0 ? Number((totalCompletedDurationMs / (totalTasks * 3600000)).toFixed(1)) : 0
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        counts: {
          total: totalTasks,
          created: createdTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
          overdue: overdueTasks,
          completionRate
        },
        slaSummary: {
          onTrack: onTrackCount,
          atRisk: atRiskCount,
          breached: breachedCount,
          met: metCount,
          completedLate: completedLateCount,
          onTimeRate: onTimeRatePercent,
          avgCompletionTime: `${averageCompletionHours}h`
        },
        statusDistribution,
        slaDistribution,
        averageTimeByStatus,
        upcomingTasks: upcomingTasks.map((t) => calculateTaskSLA(t, now)),
        recentTasks: recentTasks.map((t) => calculateTaskSLA(t, now))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const activities = await TaskActivity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('task', 'title status priority');

    res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
};
