import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Kanban,
  PlusCircle,
  Settings,
  ChevronDown,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { Clipboard3DIcon } from '../common/Illustrations';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';

export const Sidebar = ({ onCloseMobile }) => {
  const { user, logout } = useAuth();
  const { totalTasks } = useTasks();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare, badge: typeof totalTasks === 'number' ? totalTasks : 0 },
    { name: 'Kanban Board', path: '/kanban', icon: Kanban },
    { name: 'Create Task', path: '/tasks/new', icon: PlusCircle },
    { name: 'Profile / Settings', path: '/profile', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name, email) => {
    if (name && name.trim()) {
      return name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const initials = getInitials(user?.name, user?.email);

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white select-none overflow-y-auto">
      {/* Brand & Navigation */}
      <div className="p-5 flex flex-col gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-brand-600 flex items-center justify-center shadow-md shadow-brand-500/20 text-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">TaskFlow</span>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1.5 mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#eeedfd] text-brand-700 font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-brand-200/80 text-brand-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Area: 3D Checklist Illustration Card & User Profile */}
      <div className="p-4 flex flex-col gap-4">
        {/* Subtle 3D Illustration Card */}
        <div className="bg-gradient-to-b from-[#f8f7ff] to-[#f0eeff] rounded-2xl p-4 flex flex-col items-center justify-center border border-purple-100/60 shadow-sm relative overflow-hidden group">
          <div className="transform transition-transform duration-300 group-hover:scale-105">
            <Clipboard3DIcon className="w-20 h-20" />
          </div>
          <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase mt-2">
            Plan • Organize • Achieve
          </p>
        </div>

        {/* User profile dropdown pill */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name || 'User avatar'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-xs">
                    {initials}
                  </div>
                )}
              </div>
              <div className="flex flex-col text-left truncate">
                <span className="text-sm font-semibold text-slate-900 truncate">
                  {user?.name || 'TaskFlow User'}
                </span>
                <span className="text-xs text-slate-400 truncate">
                  {user?.email || 'Logged In'}
                </span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-slate-100 p-1.5 z-50">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/profile');
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg text-left"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button
                onClick={() => {
                  setProfileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg text-left"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
