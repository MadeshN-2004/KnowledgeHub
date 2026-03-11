// Fixed App.js - Clean routing structure
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddEditDocument from './pages/AddEditDocument';
import SearchPage from './pages/SearchPage';
import DocumentView from './pages/DocumentView';
import HomePage from './pages/HomePage';

// Component to conditionally render Navbar
function ConditionalNavbar() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Don't show navbar on homepage and auth pages when user is not logged in
  const hideNavbar = location.pathname === '/' || 
                    (!user && (location.pathname === '/login' || location.pathname === '/register'));
  
  return hideNavbar ? null : <Navbar />;
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ConditionalNavbar />
          
          <main>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents/new"
                element={
                  <ProtectedRoute>
                    <AddEditDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents/:id/edit"
                element={
                  <ProtectedRoute>
                    <AddEditDocument />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents/:id"
                element={
                  <ProtectedRoute>
                    <DocumentView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Redirect any unknown routes to homepage */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px'
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#ffffff'
                }
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444', 
                  secondary: '#ffffff'
                }
              }
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
