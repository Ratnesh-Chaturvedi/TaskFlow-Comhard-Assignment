import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Calendar,
  Clock,
  List as ListIcon,
  Kanban as KanbanIcon,
  AlertCircle,
  Timer,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'Created', label: 'Created', color: 'border-brand-500', badgeBg: 'bg-brand-50 text-brand-700' },
  { id: 'In Progress', label: 'In Progress', color: 'border-sky-500', badgeBg: 'bg-sky-50 text-sky-700' },
  { id: 'Completed', label: 'Completed', color: 'border-emerald-500', badgeBg: 'bg-emerald-50 text-emerald-700' }
];

export const KanbanPage = () => {
  const navigate = useNavigate();
  const { tasks, fetchTasks, updateTaskStatus, loading } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const draggedTaskIdRef = useRef(null);

  // Ensure full task list is loaded from database on mount
  useEffect(() => {
    fetchTasks({ limit: 100, page: 1, status: '' });
  }, [fetchTasks]);

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    draggedTaskIdRef.current = taskId;
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    // Only clear if leaving the column wrapper
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverColumn === colId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, columnStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskIdRef.current || draggedTaskId;
    if (!taskId) return;

    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === columnStatus) {
      setDraggedTaskId(null);
      draggedTaskIdRef.current = null;
      return;
    }

    try {
      await updateTaskStatus(taskId, columnStatus);
      toast.success(`Task moved to ${columnStatus}`);
    } catch {
      // rollback handled in context
    } finally {
      setDraggedTaskId(null);
      draggedTaskIdRef.current = null;
    }
  };

  const moveStatus = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      toast.success(`Moved to ${newStatus}`);
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  // SLA badge color helper
  const getSlaBadge = (sla) => {
    if (!sla || !sla.enabled) return null;
    switch (sla.status) {
      case 'On Track':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          text: 'On Track'
        };
      case 'At Risk':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          text: 'At Risk'
        };
      case 'Breached':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          text: 'Breached'
        };
      case 'Met':
        return {
          bg: 'bg-brand-50 text-brand-700 border-brand-200',
          dot: 'bg-brand-500',
          text: 'SLA Met'
        };
      case 'Completed Late':
        return {
          bg: 'bg-pink-50 text-pink-700 border-pink-200',
          dot: 'bg-pink-500',
          text: 'Late'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
          text: sla.status
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Kanban Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Drag and drop tasks between workflow stages. Any move updates the database and SLA timers immediately.
          </p>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200/80 rounded-xl p-1 flex items-center shadow-sm">
            <button
              onClick={() => navigate('/tasks')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 rounded-lg bg-brand-50 text-brand-700 font-semibold"
              title="Kanban Board View"
            >
              <KanbanIcon className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/tasks/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* Kanban Board 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          const isOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={(e) => handleDragLeave(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl p-4 flex flex-col gap-3 min-h-[600px] border transition-all duration-200 ${
                isOver
                  ? 'bg-brand-50/50 border-brand-400 ring-2 ring-brand-400/20 shadow-md'
                  : 'bg-slate-100/70 border-slate-200/60'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">{col.label}</h2>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                    {colTasks.length}
                  </span>
                </div>
                <Link
                  to={`/tasks/new?status=${col.id}`}
                  className="p-1 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-white transition-colors"
                  title="Add task in this column"
                >
                  <Plus className="w-4 h-4" />
                </Link>
              </div>

              {/* Task Cards in this Column */}
              <div className="flex flex-col gap-3">
                {colTasks.map((task) => {
                  const isOverdue =
                    task.dueDate &&
                    new Date(task.dueDate) < new Date() &&
                    task.status !== 'Completed';

                  const slaInfo = getSlaBadge(task.sla);

                  // Time spent in current status
                  const statusTimeText =
                    col.id === 'Created'
                      ? `Waiting: ${task.timeTracking?.currentStatusFormatted || '< 1m'}`
                      : col.id === 'In Progress'
                      ? `Working: ${task.timeTracking?.currentStatusFormatted || '< 1m'}`
                      : `Done in: ${task.timeTracking?.totalElapsedFormatted || '< 1m'}`;

                  return (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      className={`bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group hover:border-brand-300 space-y-2.5 ${
                        draggedTaskId === task._id ? 'opacity-40 scale-95' : ''
                      }`}
                    >
                      {/* Priority, SLA badge & Overdue */}
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            task.priority === 'Urgent'
                              ? 'bg-red-50 text-red-600'
                              : task.priority === 'High'
                              ? 'bg-rose-50 text-rose-600'
                              : task.priority === 'Medium'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          ↑ {task.priority}
                        </span>

                        {slaInfo && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${slaInfo.bg}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${slaInfo.dot}`} />
                            {slaInfo.text}
                          </span>
                        )}

                        {isOverdue && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors ${
                          task.status === 'Completed' ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* Description */}
                      {task.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* SLA Countdown / Time Remaining or Overdue */}
                      {task.sla?.enabled && task.sla?.remainingFormatted && (
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                          <Timer className="w-3 h-3 text-brand-500" />
                          <span className="truncate">{task.sla.remainingFormatted}</span>
                        </div>
                      )}

                      {/* Lifecycle Time Tracking Details */}
                      <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-600">{statusTimeText}</span>
                          <span>Age: {task.timeTracking?.totalElapsedFormatted || '< 1m'}</span>
                        </div>
                      </div>

                      {/* Footer: Due date & Quick State Transition Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 gap-2">
                        {task.dueDate ? (
                          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-300">No deadline</span>
                        )}

                        {/* Interactive Quick Status Buttons */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {task.status === 'Created' && (
                            <button
                              onClick={() => moveStatus(task._id, 'In Progress')}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                              title="Start working on this task"
                            >
                              <span>Start</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          {task.status === 'In Progress' && (
                            <>
                              <button
                                onClick={() => moveStatus(task._id, 'Created')}
                                className="inline-flex items-center gap-1 px-1.5 py-1 rounded-lg text-[10px] font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                                title="Move back to Created"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => moveStatus(task._id, 'Completed')}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title="Mark as Completed"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Done</span>
                              </button>
                            </>
                          )}

                          {task.status === 'Completed' && (
                            <button
                              onClick={() => moveStatus(task._id, 'In Progress')}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
                              title="Reopen task"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reopen</span>
                            </button>
                          )}

                          {/* Quick Column Dropdown */}
                          <select
                            value={task.status}
                            onChange={(e) => moveStatus(task._id, e.target.value)}
                            className="text-[10px] font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 cursor-pointer"
                          >
                            <option value="Created">Created</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-xs text-slate-400 flex flex-col items-center justify-center">
                    <span>No tasks in this stage</span>
                    <span className="text-[10px] mt-0.5">Drag tasks or click + to add</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
