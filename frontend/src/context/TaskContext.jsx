import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as taskService from '../services/taskService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    slaStatus: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10
  });

  // Fetch tasks for the authenticated user only
  const fetchTasks = useCallback(async (customParams = {}) => {
    if (!isAuthenticated) {
      setTasks([]);
      return;
    }
    setLoading(true);
    try {
      const mergedParams = { ...filters, ...customParams };
      const res = await taskService.getTasks(mergedParams);
      setTasks(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
      return res;
    } catch (err) {
      console.warn('Task fetch error:', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  // Fetch dashboard summary for the authenticated user only
  const fetchDashboard = useCallback(async () => {
    if (!isAuthenticated) {
      setDashboardData(null);
      return;
    }
    try {
      const res = await taskService.getDashboardSummary();
      setDashboardData(res.data);
      return res.data;
    } catch (err) {
      console.warn('Dashboard fetch error:', err.response?.data?.message || err.message);
    }
  }, [isAuthenticated]);

  // Re-fetch when user changes or logs in/out
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchDashboard();
    } else {
      setTasks([]);
      setDashboardData(null);
    }
  }, [isAuthenticated, user?._id]);

  // Create task
  const createTask = async (taskData) => {
    try {
      const res = await taskService.createTask(taskData);
      toast.success('Task created successfully! 🎉');
      await Promise.all([fetchTasks(), fetchDashboard()]);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create task';
      toast.error(msg);
      throw err;
    }
  };

  // Update task
  const updateTask = async (taskId, updates) => {
    try {
      const res = await taskService.updateTask(taskId, updates);
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
      fetchDashboard();
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update task';
      toast.error(msg);
      throw err;
    }
  };

  // Optimistic status update (used by Kanban and task table)
  const updateTaskStatus = async (taskId, newStatus) => {
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await taskService.updateTaskStatus(taskId, newStatus);
      const updatedTask = res.data || res;
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updatedTask : t)));
      fetchDashboard();
      return updatedTask;
    } catch (err) {
      setTasks(previousTasks); // Rollback
      const msg = err.response?.data?.message || 'Failed to update task status in database';
      toast.error(msg);
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task removed');
      fetchDashboard();
    } catch (err) {
      toast.error('Failed to delete task');
      throw err;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        totalTasks: pagination.total || dashboardData?.counts?.total || tasks.length,
        pagination,
        dashboardData,
        loading,
        filters,
        setFilters,
        fetchTasks,
        fetchDashboard,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        getTaskById: taskService.getTaskById
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
