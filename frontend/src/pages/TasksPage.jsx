import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  Kanban,
  List as ListIcon,
  Calendar,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Timer
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import toast from 'react-hot-toast';

export const TasksPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tasks, totalTasks, pagination, loading, fetchTasks, deleteTask, updateTaskStatus } = useTasks();

  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [slaFilter, setSlaFilter] = useState(searchParams.get('slaStatus') || '');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchTasks({
      status: statusFilter || undefined,
      slaStatus: slaFilter || undefined,
      priority: priorityFilter || undefined,
      search: searchQuery || undefined,
      sortBy,
      order,
      page,
      limit
    });
  }, [statusFilter, slaFilter, priorityFilter, sortBy, order, page, limit]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchTasks({
        status: statusFilter || undefined,
        slaStatus: slaFilter || undefined,
        priority: priorityFilter || undefined,
        search: searchQuery || undefined,
        sortBy,
        order,
        page: 1,
        limit
      });
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setDeleteConfirmId(null);
    } catch {
      // handled in context
    }
  };

  const handleStatusToggle = async (task) => {
    const nextStatus =
      task.status === 'Completed'
        ? 'In Progress'
        : task.status === 'In Progress'
        ? 'Completed'
        : 'In Progress';

    try {
      await updateTaskStatus(task._id, nextStatus);
      toast.success(`Marked as ${nextStatus}`);
    } catch {
      // handled
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              My Tasks
            </h1>
            <span className="text-xs font-semibold px-2.5 py-1 bg-brand-100 text-brand-700 rounded-full">
              {pagination.total || totalTasks} tasks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage, organize, and prioritize tasks with real-time SLA tracking.
          </p>
        </div>

        {/* View Switcher and Create Button */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200/80 rounded-xl p-1 flex items-center shadow-sm">
            <button
              className="p-1.5 rounded-lg bg-brand-50 text-brand-700 font-semibold"
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/kanban')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
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

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">All Statuses</option>
            <option value="Created">Created</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* SLA Filter (Section 8 Requirement) */}
          <select
            value={slaFilter}
            onChange={(e) => {
              setSlaFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">All SLA States</option>
            <option value="On Track">On Track</option>
            <option value="At Risk">At Risk</option>
            <option value="Breached">Breached</option>
            <option value="Met">Met</option>
            <option value="Completed Late">Completed Late</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Sort By */}
          <select
            value={`${sortBy}-${order}`}
            onChange={(e) => {
              const [sb, ord] = e.target.value.split('-');
              setSortBy(sb);
              setOrder(ord);
            }}
            className="px-2.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="slaDeadline-asc">SLA Deadline (Earliest)</option>
            <option value="currentStatusDuration-desc">Longest in Status</option>
            <option value="totalElapsedTime-desc">Total Age (Oldest)</option>
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="title-asc">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-slate-200 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No tasks found</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              No tasks match your selected criteria. Try adjusting your filters or create a new task.
            </p>
            <Link
              to="/tasks/new"
              className="mt-4 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
            >
              Create New Task
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">SLA State</th>
                  <th className="py-3 px-4">Status Duration</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {tasks.map((task) => {
                  const sla = task.sla;
                  return (
                    <tr
                      key={task._id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      {/* Checkbox status toggle */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleStatusToggle(task)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            task.status === 'Completed'
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 hover:border-brand-500 text-transparent hover:text-slate-300'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 fill-current" />
                        </button>
                      </td>

                      {/* Title & Description */}
                      <td
                        className="py-3.5 px-4 max-w-xs"
                        onClick={() => navigate(`/tasks/${task._id}`)}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-slate-900 group-hover:text-brand-600 transition-colors ${
                              task.status === 'Completed' ? 'line-through text-slate-400' : ''
                            }`}
                          >
                            {task.title}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              task.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : task.status === 'In Progress'
                                ? 'bg-sky-50 text-sky-700'
                                : 'bg-brand-50 text-brand-700'
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md ${
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
                      </td>

                      {/* SLA Indicator */}
                      <td className="py-3.5 px-4">
                        {sla?.enabled ? (
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                              sla.status === 'On Track'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : sla.status === 'At Risk'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : sla.status === 'Breached'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : sla.status === 'Met'
                                ? 'bg-brand-50 text-brand-700 border-brand-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                sla.status === 'On Track' ? 'bg-emerald-500' :
                                sla.status === 'At Risk' ? 'bg-amber-500' :
                                sla.status === 'Breached' ? 'bg-rose-500' : 'bg-brand-500'
                              }`}
                            />
                            {sla.status}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">Disabled</span>
                        )}
                      </td>

                      {/* Current Status Duration */}
                      <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-1">
                          <Timer className="w-3.5 h-3.5 text-slate-400" />
                          <span>{task.timeTracking?.currentStatusFormatted || '< 1m'}</span>
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {task.dueDate ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">No date</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/tasks/${task._id}`)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/tasks/${task._id}/edit`)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700"
                            title="Edit Task"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(task._id)}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Task</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to permanently delete this task? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-md shadow-rose-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
