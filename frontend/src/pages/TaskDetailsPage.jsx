import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  Folder,
  Edit3,
  Trash2,
  Activity,
  History,
  Timer,
  ShieldAlert,
  Check,
  Hourglass
} from 'lucide-react';
import {
  getTaskById,
  updateTaskStatus,
  deleteTask,
  getTaskActivities
} from '../services/taskService';
import toast from 'react-hot-toast';

export const TaskDetailsPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const [taskRes, actRes] = await Promise.all([
        getTaskById(taskId),
        getTaskActivities(taskId)
      ]);
      setTask(taskRes.data);
      setActivities(actRes.data || []);
    } catch (err) {
      toast.error('Task not found');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [taskId]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await updateTaskStatus(taskId, newStatus);
      setTask(res.data);
      toast.success(`Status updated to ${newStatus}`);
      fetchDetails();
    } catch (err) {
      toast.error('Failed to change status');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(taskId);
      toast.success('Task deleted');
      navigate('/tasks');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading task details...</div>;
  }

  if (!task) return null;

  const sla = task.sla || {};
  const timeTracking = task.timeTracking || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Back button & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </button>

        <div className="flex items-center gap-2">
          <Link
            to={`/tasks/${taskId}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
            <span>Edit</span>
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 border border-rose-200/80 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Task Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        {/* Status Dropdown, Priority & SLA Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">Status:</span>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                task.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : task.status === 'In Progress'
                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                  : 'bg-brand-50 text-brand-700 border-brand-200'
              }`}
            >
              <option value="Created">Created</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Priority Badge */}
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                task.priority === 'Urgent'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : task.priority === 'High'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : task.priority === 'Medium'
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}
            >
              ↑ {task.priority} Priority
            </span>

            {/* SLA Badge */}
            {sla.enabled && (
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
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
                SLA: {sla.status}
              </span>
            )}
          </div>
        </div>

        {/* Task Title & Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {task.title}
          </h1>
          <p className="text-sm text-slate-600 mt-3 whitespace-pre-line leading-relaxed">
            {task.description || 'No description provided.'}
          </p>
        </div>

        {/* General Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Due Date</span>
            <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'None'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Category</span>
            <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
              <Folder className="w-3.5 h-3.5 text-slate-400" />
              {task.category || 'General'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Created</span>
            <span className="font-semibold text-slate-800 mt-0.5">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block">Total Elapsed Time</span>
            <span className="font-semibold text-slate-800 mt-0.5">
              {timeTracking.totalElapsedFormatted || '< 1m'}
            </span>
          </div>
        </div>

        {/* Tags */}
        {task.tags?.length > 0 && (
          <div className="flex items-center gap-2 pt-1">
            <Tag className="w-4 h-4 text-slate-400" />
            <div className="flex flex-wrap gap-1.5">
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DEDICATED TIME TRACKING & SLA PANEL (Section 6 Requirement) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900">Time Tracking & SLA Commitment</h2>
          </div>
          {sla.enabled && (
            <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              Commitment: {sla.durationMinutes >= 1440 && sla.durationMinutes % 1440 === 0
                ? `${sla.durationMinutes / 1440}d`
                : sla.durationMinutes >= 60
                ? `${(sla.durationMinutes / 60).toFixed(sla.durationMinutes % 60 === 0 ? 0 : 1)}h`
                : `${sla.durationMinutes}m`} ({sla.startType === 'first_start' ? 'from start' : 'from creation'})
            </span>
          )}
        </div>

        {/* SLA Status & Target Deadline Box */}
        {sla.enabled ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-gradient-to-br from-brand-50/40 to-slate-50 border border-brand-100/70 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block">SLA Target Deadline</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">
                {sla.deadline ? new Date(sla.deadline).toLocaleString() : 'Pending First Start'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block">SLA State</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  sla.status === 'On Track' ? 'bg-emerald-500' :
                  sla.status === 'At Risk' ? 'bg-amber-500' :
                  sla.status === 'Breached' ? 'bg-rose-500' :
                  sla.status === 'Met' ? 'bg-brand-500' : 'bg-slate-400'
                }`} />
                {sla.status}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block">SLA Balance / Result</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">
                {sla.remainingFormatted || 'Calculated on schedule'}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-50 text-xs text-slate-500 text-center">
            SLA tracking is disabled for this task.
          </div>
        )}

        {/* Cumulative Time Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Cumulative Status Durations</span>
            <span className="text-slate-400">Total: {timeTracking.totalElapsedFormatted || '< 1m'}</span>
          </div>

          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${timeTracking.percentages?.created || 0}%` }}
              className="bg-amber-400 h-full"
              title={`Created: ${timeTracking.timeInCreatedFormatted}`}
            />
            <div
              style={{ width: `${timeTracking.percentages?.inProgress || 0}%` }}
              className="bg-sky-500 h-full"
              title={`In Progress: ${timeTracking.timeInProgressFormatted}`}
            />
            <div
              style={{ width: `${timeTracking.percentages?.completed || 0}%` }}
              className="bg-brand-600 h-full"
              title={`Completed: ${timeTracking.timeInCompletedFormatted}`}
            />
          </div>

          {/* Legend and times */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
            <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
              <span className="text-[11px] font-semibold text-amber-800 block">Time in Created</span>
              <span className="text-sm font-bold text-amber-900 mt-0.5 block">
                {timeTracking.timeInCreatedFormatted || '< 1m'}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-sky-50/60 border border-sky-100 text-center">
              <span className="text-[11px] font-semibold text-sky-800 block">Time in Progress</span>
              <span className="text-sm font-bold text-sky-900 mt-0.5 block">
                {timeTracking.timeInProgressFormatted || '0m'}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-brand-50/60 border border-brand-100 text-center">
              <span className="text-[11px] font-semibold text-brand-800 block">Time in Completed</span>
              <span className="text-sm font-bold text-brand-900 mt-0.5 block">
                {timeTracking.timeInCompletedFormatted || '0m'}
              </span>
            </div>
          </div>
        </div>

        {/* Chronological Status History Timeline (Section 6 Requirement) */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Chronological Status Timeline
          </h3>

          {task.statusHistory && task.statusHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="py-2 px-3">From</th>
                    <th className="py-2 px-3">To Status</th>
                    <th className="py-2 px-3">Transition Time</th>
                    <th className="py-2 px-3 text-right">Time Spent in Previous</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {task.statusHistory.map((h, i) => (
                    <tr key={i} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-medium text-slate-500">{h.fromStatus || 'Created'}</td>
                      <td className="py-2.5 px-3 font-bold text-brand-700">{h.toStatus}</td>
                      <td className="py-2.5 px-3 text-slate-500">{new Date(h.transitionAt).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-700">
                        {h.durationSeconds > 0 ? `${Math.round(h.durationSeconds / 60)}m` : '0m'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Historical status transition records will appear here.</p>
          )}
        </div>
      </div>

      {/* Activity Timeline Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-brand-600" />
          <h2 className="text-base font-bold text-slate-900">Activity History</h2>
        </div>

        {activities.length === 0 ? (
          <p className="text-xs text-slate-400">No activity logged yet.</p>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activities.map((act) => (
              <div key={act._id} className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-white" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-800">{act.description}</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(act.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Delete Task</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete "{task.title}"?
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
