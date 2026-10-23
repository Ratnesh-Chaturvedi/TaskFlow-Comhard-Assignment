import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TaskForm } from '../components/forms/TaskForm';
import { useTasks } from '../context/TaskContext';

export const CreateTaskPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'Created';
  const { createTask } = useTasks();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (payload) => {
    setIsSubmitting(true);
    try {
      const created = await createTask(payload);
      navigate(`/tasks/${created._id}`);
    } catch {
      // toast handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Create New Task
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Add a new task with SLA commitments and priority to stay on track.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <TaskForm
          initialData={{ status: initialStatus }}
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};
