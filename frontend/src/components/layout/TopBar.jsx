import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopBar = ({ onOpenMobile, onSearchClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 px-6 sm:px-8 bg-[#f7f8fd]/90 backdrop-blur-md sticky top-0 border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between gap-4 z-30 flex-shrink-0">
      {/* Mobile toggle */}
      <button
        onClick={onOpenMobile}
        className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white/80 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sticky Global Search Bar (matching screenshot pill) */}
      <div className="flex-1 max-w-md">
        <div
          onClick={onSearchClick}
          className="flex items-center gap-2.5 px-4 py-2 bg-white/95 hover:bg-white text-slate-400 hover:text-slate-600 border border-slate-200/90 rounded-full shadow-sm cursor-pointer transition-all duration-200 hover:shadow"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-normal text-slate-500 flex-1 truncate">
            Search your tasks...
          </span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-medium text-slate-400 bg-slate-100 rounded border border-slate-200">
            ⌘ + K
          </kbd>
        </div>
      </div>

      {/* Right Actions: Current User Avatar & Menu */}
      <div className="flex items-center gap-3">
        {/* User Profile Avatar with dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-9 h-9 rounded-full ring-2 ring-white shadow-sm flex items-center justify-center overflow-hidden focus:outline-none transition-transform hover:scale-105"
            title={user?.name || user?.email || 'User profile'}
          >
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
              <div className="w-full h-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs select-none">
                {initials}
              </div>
            )}
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {user?.name || 'TaskFlow User'}
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {user?.email || 'Logged In'}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Profile & Settings</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
