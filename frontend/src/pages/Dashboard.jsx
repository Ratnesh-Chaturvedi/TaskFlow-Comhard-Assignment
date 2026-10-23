import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  Plus,
  Clock,
  CheckCircle2,
  BarChart2,
  Zap,
  CheckSquare,
  Calendar,
  ChevronRight,
  ArrowRight,
  Timer,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Inbox
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Sparkline, Clipboard3DIcon } from '../components/common/Illustrations';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const { dashboardData, loading, updateTaskStatus } = useTasks();
  const navigate = useNavigate();

  // Dynamic real counts (default to 0 when empty)
  const counts = dashboardData?.counts || {
    total: 0,
    created: 0,
    inProgress: 0,
    completed: 0,
    completionRate: 0
  };

  // Dynamic SLA summary (default to 0 when empty)
  const slaSummary = dashboardData?.slaSummary || {
    onTrack: 0,
    atRisk: 0,
    breached: 0,
    met: 0,
    completedLate: 0,
    onTimeRate: 100,
    avgCompletionTime: '0.0h'
  };

  const hasTasks = counts.total > 0;

  // Donut status distribution: real values if tasks exist, or placeholder grey ring
  const statusDistribution = hasTasks
    ? (dashboardData?.statusDistribution || [
        { name: 'Completed', value: counts.completed, color: '#8b5cf6' },
        { name: 'In Progress', value: counts.inProgress, color: '#38bdf8' },
        { name: 'Created', value: counts.created, color: '#f59e0b' }
      ])
    : [{ name: 'No tasks', value: 1, color: '#f1f5f9' }];

  const upcomingTasks = dashboardData?.upcomingTasks || [];
  const recentTasks = dashboardData?.recentTasks || [];

  // Date badge helper for upcoming deadlines
  const getDueBadge = (dueDateStr) => {
    if (!dueDateStr) return null;
    const due = new Date(dueDateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const diffTime = dueDay - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: `${Math.abs(diffDays)}d overdue`,
        className: 'text-rose-600 bg-rose-50 border-rose-200'
      };
    }
    if (diffDays === 0) {
      return {
        text: 'Today',
        className: 'text-rose-600 bg-rose-50 border-rose-100 font-bold'
      };
    }
    if (diffDays === 1) {
      return {
        text: 'Tomorrow',
        className: 'text-amber-600 bg-amber-50 border-amber-100'
      };
    }
    return {
      text: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      className: 'text-brand-600 bg-brand-50 border-brand-100'
    };
  };

  const handleToggleTaskStatus = async (task, e) => {
    e.stopPropagation();
    const nextStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    try {
      await updateTaskStatus(task._id, nextStatus);
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-200">
      {/* 1. Header with greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans flex items-center gap-2">
            Welcome back, {user?.name ? user.name.split(' ')[0] : (user?.email ? user.email.split('@')[0] : 'there')}! <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {hasTasks
              ? `You have ${counts.total} task${counts.total === 1 ? '' : 's'} in your private room.`
              : 'Your workspace is ready. Create your first task to get started.'}
          </p>
        </div>

        {/* Date Selector Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-700 self-start sm:self-auto cursor-default">
          <Calendar className="w-4 h-4 text-brand-600" />
          <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* 2. Top Metric Cards Row (4 cards matching screenshot design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tasks */}
        <Link
          to="/tasks"
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-sm">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <Sparkline color="#8b5cf6" className="w-20 h-7 opacity-80" />
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-500">Total Tasks</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {counts.total}
              </span>
              <span className="inline-flex items-center text-xs font-medium text-slate-500">
                {counts.total === 1 ? '1 item' : `${counts.total} items`}
              </span>
            </div>
          </div>
        </Link>

        {/* Card 2: Created */}
        <Link
          to="/tasks?status=Created"
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-sm">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <Sparkline color="#38bdf8" className="w-20 h-7 opacity-80" />
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-500">Created</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {counts.created}
              </span>
              <span className="inline-flex items-center text-xs font-medium text-sky-600">
                Awaiting pickup
              </span>
            </div>
          </div>
        </Link>

        {/* Card 3: In Progress */}
        <Link
          to="/tasks?status=In Progress"
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-sm">
              <Clock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <Sparkline color="#f59e0b" className="w-20 h-7 opacity-80" />
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-500">In Progress</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {counts.inProgress}
              </span>
              <span className="inline-flex items-center text-xs font-medium text-amber-600">
                Active now
              </span>
            </div>
          </div>
        </Link>

        {/* Card 4: Completed */}
        <Link
          to="/tasks?status=Completed"
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <Sparkline color="#10b981" className="w-20 h-7 opacity-80" />
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-500">Completed</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {counts.completed}
              </span>
              <span className="inline-flex items-center text-xs font-medium text-emerald-600">
                {counts.completionRate}% rate
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* 3. SLA & Time Tracking Overview Panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              SLA & Time Tracking Overview
            </h2>
          </div>
          <Link
            to="/tasks?slaStatus=At Risk"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Review SLA Risks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* On Track */}
          <Link
            to="/tasks?slaStatus=On Track"
            className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-50 transition-colors"
          >
            <span className="text-[11px] font-semibold text-emerald-700 block">SLA On Track</span>
            <span className="text-xl font-bold text-emerald-900 mt-1 block">{slaSummary.onTrack}</span>
          </Link>

          {/* At Risk */}
          <Link
            to="/tasks?slaStatus=At Risk"
            className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 hover:bg-amber-50 transition-colors"
          >
            <span className="text-[11px] font-semibold text-amber-700 block">At Risk</span>
            <span className="text-xl font-bold text-amber-900 mt-1 block">{slaSummary.atRisk}</span>
          </Link>

          {/* Breached */}
          <Link
            to="/tasks?slaStatus=Breached"
            className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 hover:bg-rose-50 transition-colors"
          >
            <span className="text-[11px] font-semibold text-rose-700 block">Active Breaches</span>
            <span className="text-xl font-bold text-rose-900 mt-1 block">{slaSummary.breached}</span>
          </Link>

          {/* Met within SLA */}
          <Link
            to="/tasks?slaStatus=Met"
            className="p-3 rounded-xl bg-brand-50/60 border border-brand-100 hover:bg-brand-50 transition-colors"
          >
            <span className="text-[11px] font-semibold text-brand-700 block">Met SLA</span>
            <span className="text-xl font-bold text-brand-900 mt-1 block">{slaSummary.met}</span>
          </Link>

          {/* On-Time Rate */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-600 block">On-Time Rate</span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">{slaSummary.onTimeRate}%</span>
          </div>

          {/* Avg Completion Time */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-600 block">Avg Resolution</span>
            <span className="text-xl font-bold text-slate-900 mt-1 block">{slaSummary.avgCompletionTime}</span>
          </div>
        </div>
      </div>

      {/* 4. Middle Row: Task Overview & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Task Overview (Donut Chart) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">Task Overview</h2>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* Donut Chart with Centered Percentage */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={54}
                    outerRadius={74}
                    paddingAngle={hasTasks ? 4 : 0}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {counts.completionRate}%
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {hasTasks ? 'Completed' : 'No Tasks'}
                </span>
              </div>
            </div>

            {/* Legend with counts */}
            <div className="flex flex-col gap-3 min-w-[140px]">
              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                  <span className="text-slate-600">Completed</span>
                </div>
                <span className="font-bold text-slate-900">{counts.completed}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span className="text-slate-600">In Progress</span>
                </div>
                <span className="font-bold text-slate-900">{counts.inProgress}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600">Created</span>
                </div>
                <span className="font-bold text-slate-900">{counts.created}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">Upcoming Deadlines</h2>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {upcomingTasks.length > 0 ? (
            <div className="flex flex-col divide-y divide-slate-50">
              {upcomingTasks.map((task) => {
                const badge = getDueBadge(task.dueDate);
                return (
                  <div
                    key={task._id}
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="flex items-center justify-between py-2.5 hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          task.priority === 'High'
                            ? 'bg-rose-500'
                            : task.priority === 'Medium'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <span className="text-sm font-semibold text-slate-800 truncate group-hover:text-brand-600 transition-colors">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {badge && (
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.className}`}>
                          {badge.text}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-2">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-slate-700">No upcoming deadlines</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Tasks with due dates will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Bottom Row: Recent Tasks & "Stay on track!" Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Tasks Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-brand-600" />
              <h2 className="text-base font-bold text-slate-900">Recent Tasks</h2>
            </div>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {recentTasks.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="flex flex-col divide-y divide-slate-100 min-w-[500px]">
                {recentTasks.map((task) => {
                  const isCompleted = task.status === 'Completed';
                  const dueBadge = getDueBadge(task.dueDate);

                  return (
                    <div
                      key={task._id}
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      className="flex items-center justify-between py-3 px-2 hover:bg-slate-50/80 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={(e) => handleToggleTaskStatus(task, e)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer flex-shrink-0"
                        />
                        <span
                          className={`text-sm font-semibold truncate ${
                            isCompleted
                              ? 'line-through text-slate-400'
                              : 'text-slate-900 group-hover:text-brand-600 transition-colors'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Status Badge */}
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            task.status === 'Completed'
                              ? 'text-emerald-700 bg-emerald-50'
                              : task.status === 'In Progress'
                              ? 'text-sky-700 bg-sky-50'
                              : 'text-amber-700 bg-amber-50'
                          }`}
                        >
                          {task.status}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                            task.priority === 'High'
                              ? 'text-rose-600 bg-rose-50'
                              : task.priority === 'Medium'
                              ? 'text-amber-600 bg-amber-50'
                              : 'text-emerald-600 bg-emerald-50'
                          }`}
                        >
                          {task.priority === 'High' ? '↑ High' : task.priority === 'Medium' ? '• Med' : '↓ Low'}
                        </span>

                        {/* Due Date */}
                        {dueBadge ? (
                          <span className={`text-xs px-2 py-0.5 rounded-md border flex items-center gap-1 ${dueBadge.className}`}>
                            <Calendar className="w-3 h-3" />
                            {dueBadge.text}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">No deadline</span>
                        )}

                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-3">
                <Inbox className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">No tasks in your room yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Every task you create belongs strictly to you with real-time lifecycle tracking and SLA calculations.
              </p>
              <button
                onClick={() => navigate('/tasks/new')}
                className="mt-4 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                + Create First Task
              </button>
            </div>
          )}
        </div>

        {/* "Stay on track!" Callout Banner */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#f5f3ff] via-[#ede9fe] to-[#e0e7ff] rounded-2xl p-6 border border-brand-100 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="flex items-center gap-4">
            <div className="transform transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
              <Clipboard3DIcon className="w-20 h-20" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Stay on track!</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Organize your tasks and achieve more every day.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate('/tasks/new')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-md shadow-brand-700/25 transition-all hover:gap-3"
            >
              <span>Create Task</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
