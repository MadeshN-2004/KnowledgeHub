import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Search, Plus, Home, Bot, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="relative bg-gradient-to-r from-white via-slate-50 to-white shadow-xl border-b border-slate-200/60 backdrop-blur-sm">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 via-transparent to-purple-50/30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="group flex items-center space-x-2 hover:scale-105 transition-all duration-300">
              <div className="relative">
                <Bot className="h-8 w-8 text-indigo-600 group-hover:text-indigo-500 transition-colors duration-300" />
                <div className="absolute -inset-1 bg-indigo-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 bg-clip-text text-transparent">
                KnowledgeHub
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`group relative flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 shadow-md shadow-indigo-200/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'
              }`}
            >
              <Home className={`h-4 w-4 transition-transform duration-300 ${
                isActive('/') ? 'scale-110' : 'group-hover:scale-110'
              }`} />
              <span>Home</span>
              {isActive('/') && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></div>
              )}
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`group relative flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    isActive('/dashboard')
                      ? 'bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 shadow-md shadow-indigo-200/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'
                  }`}
                >
                  <Home className={`h-4 w-4 transition-transform duration-300 ${
                    isActive('/dashboard') ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span>Dashboard</span>
                  {isActive('/dashboard') && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></div>
                  )}
                </Link>

                <Link
                  to="/documents/new"
                  className={`group relative flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    isActive('/documents/new')
                      ? 'bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 shadow-md shadow-indigo-200/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'
                  }`}
                >
                  <Plus className={`h-4 w-4 transition-transform duration-300 ${
                    isActive('/documents/new') ? 'scale-110 rotate-90' : 'group-hover:scale-110 group-hover:rotate-90'
                  }`} />
                  <span>New Doc</span>
                  {isActive('/documents/new') && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></div>
                  )}
                </Link>

                <Link
                  to="/search"
                  className={`group relative flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    isActive('/search')
                      ? 'bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 shadow-md shadow-indigo-200/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50'
                  }`}
                >
                  <Search className={`h-4 w-4 transition-transform duration-300 ${
                    isActive('/search') ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
                  <span>Search</span>
                  {isActive('/search') && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full animate-pulse"></div>
                  )}
                </Link>

                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200/60">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.name} 
                      {user.role === 'admin' && (
                        <span className="ml-2 text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-2 py-1 rounded-full border border-purple-200/50 shadow-sm">
                          Admin
                        </span>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="group flex items-center space-x-1 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;