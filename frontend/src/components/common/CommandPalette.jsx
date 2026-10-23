import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, CheckSquare, ArrowRight } from 'lucide-react';
import { getTasks } from '../../services/taskService';

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getTasks({ search: query, limit: 6 });
        setTasks(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search tasks by title, description, or tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {loading ? (
            <div className="p-6 text-center text-xs text-slate-400">Searching tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              {query ? 'No matching tasks found' : 'Type to search for tasks...'}
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => {
                    navigate(`/tasks/${task._id}`);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-brand-50 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-3 truncate">
                    <CheckSquare className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    <div className="truncate">
                      <span className="text-sm font-medium text-slate-800 group-hover:text-brand-700 block truncate">
                        {task.title}
                      </span>
                      <span className="text-xs text-slate-400">
                        {task.status} • {task.priority} priority
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
