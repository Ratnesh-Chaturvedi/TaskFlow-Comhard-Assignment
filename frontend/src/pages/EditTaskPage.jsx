import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaskForm } from '../components/forms/TaskForm';
import { useTasks } from '../context/TaskContext';
import toast from 'react-hot-toast';

export const EditTaskPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { getTaskById, updateTask } = useTasks();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getTaskById(taskId);
        setTask(res.data);
      } catch (err) {
        toast.error('Task not found');
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [taskId]);

  const handleUpdate = async (payload) => {
    setIsSubmitting(true);
    try {
      await updateTask(taskId, payload);
      navigate(`/tasks/${taskId}`);
    } catch {
      // toast handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-400">Loading task details...</div>;
  }

  if (!task) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Edit Task
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Modify task information, priority, and update SLA commitments.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <TaskForm
          initialData={task}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
          title="Edit Task"
        />
      </div>
    </div>
  );
};
