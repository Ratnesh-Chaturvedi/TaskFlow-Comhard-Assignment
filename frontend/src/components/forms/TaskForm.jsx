import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ShieldAlert,
  Loader2,
  Sparkles,
  Timer,
  ChevronDown,
  CheckCircle,
  Zap
} from 'lucide-react';

export const TaskForm = ({ initialData = {}, onSubmit, isSubmitting, title = 'Task Form' }) => {
  const navigate = useNavigate();

  // Helper to determine initial custom value and unit from minutes
  const getInitialSlaParts = (mins = 480) => {
    if (mins >= 10080 && mins % 10080 === 0) {
      return { value: mins / 10080, unit: 'weeks' };
    }
    if (mins >= 1440 && mins % 1440 === 0) {
      return { value: mins / 1440, unit: 'days' };
    }
    if (mins >= 60 && mins % 60 === 0) {
      return { value: mins / 60, unit: 'hours' };
    }
    return { value: mins, unit: 'minutes' };
  };

  const initialParts = getInitialSlaParts(initialData.slaDurationMinutes || 480);

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    status: initialData.status || 'Created',
    priority: initialData.priority || 'Medium',
    dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 10) : '',
    startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : '',
    category: initialData.category || '',
    tagsString: initialData.tags ? initialData.tags.join(', ') : '',
    // SLA fields
    slaEnabled: initialData.slaEnabled !== false,
    slaDurationMinutes: initialData.slaDurationMinutes || 480,
    slaStartType: initialData.slaStartType || 'creation'
  });

  const [customValue, setCustomValue] = useState(initialParts.value);
  const [customUnit, setCustomUnit] = useState(initialParts.unit);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [errors, setErrors] = useState({});

  const presets = [
    { label: '30m', minutes: 30 },
    { label: '1 Hour', minutes: 60 },
    { label: '2 Hours', minutes: 120 },
    { label: '4 Hours', minutes: 240 },
    { label: '8 Hours (1 Day)', minutes: 480 },
    { label: '24 Hours', minutes: 1440 },
    { label: '2 Days', minutes: 2880 },
    { label: '3 Days', minutes: 4320 },
    { label: '1 Week', minutes: 10080 }
  ];

  // Sync custom value & unit when formData.slaDurationMinutes changes from preset
  const handleSelectPreset = (minutes) => {
    setIsCustomMode(false);
    setFormData((prev) => ({ ...prev, slaDurationMinutes: minutes }));
    const parts = getInitialSlaParts(minutes);
    setCustomValue(parts.value);
    setCustomUnit(parts.unit);
  };

  // Handle custom input change
  const handleCustomChange = (val, unit) => {
    setIsCustomMode(true);
    const num = Math.max(0.1, Number(val) || 1);
    setCustomValue(val);
    setCustomUnit(unit);

    let minutes = num;
    if (unit === 'hours') minutes = Math.round(num * 60);
    else if (unit === 'days') minutes = Math.round(num * 1440);
    else if (unit === 'weeks') minutes = Math.round(num * 10080);
    else minutes = Math.round(num);

    setFormData((prev) => ({ ...prev, slaDurationMinutes: Math.max(1, minutes) }));
  };

  // Optional direct target date & time selector calculation
  const handleDirectTargetDateTime = (e) => {
    const val = e.target.value;
    if (!val) return;
    const targetDate = new Date(val);
    const now = new Date();
    const diffMs = targetDate - now;
    if (diffMs > 0) {
      const minutes = Math.round(diffMs / 60000);
      setIsCustomMode(true);
      setFormData((prev) => ({ ...prev, slaDurationMinutes: Math.max(1, minutes) }));
      const parts = getInitialSlaParts(minutes);
      setCustomValue(parts.value);
      setCustomUnit(parts.unit);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Task title is required';
    }
    if (formData.startDate && formData.dueDate && new Date(formData.startDate) > new Date(formData.dueDate)) {
      errs.dueDate = 'Due date cannot be before start date';
    }
    if (formData.slaEnabled && (!formData.slaDurationMinutes || formData.slaDurationMinutes < 1)) {
      errs.slaDuration = 'SLA duration must be at least 1 minute';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = formData.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      category: formData.category.trim(),
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      tags,
      slaEnabled: formData.slaEnabled,
      slaDurationMinutes: Number(formData.slaDurationMinutes),
      slaStartType: formData.slaStartType
    };

    onSubmit(payload);
  };

  // Preview formatted duration helper
  const getFormattedDuration = (totalMinutes) => {
    if (!totalMinutes || totalMinutes < 1) return '0 minutes';
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const mins = totalMinutes % 60;
    const parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
    if (mins > 0 || parts.length === 0) parts.push(`${mins} min${mins > 1 ? 's' : ''}`);
    return parts.join(' ');
  };

  // Preview deadline calculation
  const getPreviewDeadline = () => {
    if (!formData.slaEnabled) return 'SLA Disabled';
    const formattedDuration = getFormattedDuration(formData.slaDurationMinutes);
    if (formData.slaStartType === 'first_start') {
      return `Countdown begins when task moves to "In Progress" (${formattedDuration} allocated)`;
    }
    const target = new Date(Date.now() + formData.slaDurationMinutes * 60000);
    return `${target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${formattedDuration})`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Task Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Implement user authentication flow"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
            errors.title ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200 focus:border-brand-500'
          }`}
        />
        {errors.title && <p className="text-xs text-rose-500 mt-1.5">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Description
        </label>
        <textarea
          rows="3"
          placeholder="Add details, objectives, or specifications for this task..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed"
        />
      </div>

      {/* Status & Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Initial Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
          >
            <option value="Created">Created</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* SLA Configuration Card - Ultra Flexible */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-brand-50/50 via-indigo-50/30 to-purple-50/20 border border-brand-100 shadow-sm space-y-5">
        {/* Header with Switch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                SLA & Resolution Tracking
              </span>
              <span className="text-[11px] text-slate-500">
                Track resolution targets, breach warnings, and lifecycle durations.
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.slaEnabled}
              onChange={(e) => setFormData({ ...formData, slaEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>

        {formData.slaEnabled && (
          <div className="space-y-4 pt-1 border-t border-brand-100/60">
            {/* 1. Quick Presets */}
            <div>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Quick Duration Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => {
                  const isSelected = !isCustomMode && formData.slaDurationMinutes === p.minutes;
                  return (
                    <button
                      key={p.minutes}
                      type="button"
                      onClick={() => handleSelectPreset(p.minutes)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-600/20'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setIsCustomMode(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isCustomMode
                      ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-600/20'
                      : 'bg-white text-slate-700 border border-dashed border-slate-300 hover:border-brand-400 hover:bg-slate-50'
                  }`}
                >
                  ⚡ Custom Value
                </button>
              </div>
            </div>

            {/* 2. Flexible Custom Duration Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/90 p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              {/* Custom Number Input & Unit Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Assign Custom Value:</span>
                  <span className="text-[11px] font-semibold text-brand-600">
                    {formData.slaDurationMinutes} mins total
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step="any"
                      min="1"
                      max="525600"
                      value={customValue}
                      onChange={(e) => handleCustomChange(e.target.value, customUnit)}
                      placeholder="e.g. 3"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  {/* Unit Selector: Minutes / Hours / Days / Weeks */}
                  <select
                    value={customUnit}
                    onChange={(e) => handleCustomChange(customValue, e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                  </select>
                </div>
                {errors.slaDuration && <p className="text-xs text-rose-500 mt-1">{errors.slaDuration}</p>}
              </div>

              {/* Countdown Trigger Condition */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Countdown Start Trigger:
                </label>
                <select
                  value={formData.slaStartType}
                  onChange={(e) => setFormData({ ...formData, slaStartType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
                >
                  <option value="creation">🟢 From Task Creation (Starts immediately)</option>
                  <option value="first_start">🔵 From In Progress (Starts when you begin work)</option>
                </select>
              </div>
            </div>

            {/* 3. Optional Direct Deadline Date & Time Picker */}
            <div className="bg-white/70 p-3 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-600" />
                Or pick an exact completion date & time:
              </span>
              <input
                type="datetime-local"
                onChange={handleDirectTargetDateTime}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            {/* 4. Live Dynamic Preview Banner */}
            <div className="p-3.5 bg-white rounded-2xl border border-brand-200/80 shadow-sm flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 mt-0.5">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <span className="font-bold text-slate-800 block">
                  Target SLA Commitment: {getFormattedDuration(formData.slaDurationMinutes)}
                </span>
                <span className="text-slate-500 block mt-0.5 leading-relaxed">
                  {getPreviewDeadline()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Target Dates & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Target Due Date (Optional)
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
              errors.dueDate ? 'border-rose-300' : 'border-slate-200 focus:border-brand-500'
            }`}
          />
          {errors.dueDate && <p className="text-xs text-rose-500 mt-1.5">{errors.dueDate}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Category
          </label>
          <input
            type="text"
            placeholder="e.g. Engineering, Design, Operations"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Tags (comma separated)
        </label>
        <input
          type="text"
          placeholder="e.g. Urgent, Frontend, Backend, Sprint-1"
          value={formData.tagsString}
          onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-600/20 disabled:opacity-50 transition-all hover:shadow-lg"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Save Task</span>
        </button>
      </div>
    </form>
  );
};
