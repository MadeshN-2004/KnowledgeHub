import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Clock, 
  Tag,
  History,
  X
} from 'lucide-react';

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [document, setDocument] = useState(null);
  const [versions, setVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocument();
    fetchVersions();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`/documents/${id}`);
      setDocument(response.data);
    } catch (error) {
      toast.error('Failed to fetch document');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchVersions = async () => {
    try {
      const response = await axios.get(`/documents/${id}/versions`);
      setVersions(response.data);
    } catch (error) {
      console.error('Failed to fetch versions');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await axios.delete(`/documents/${id}`);
      toast.success('Document deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const canEdit = () => {
    return user.role === 'admin' || document.createdBy._id === user.id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
          </div>
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce animation-delay-100"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce animation-delay-200"></div>
            </div>
            <p className="text-indigo-600 font-medium mt-2">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-red-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-12 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <X className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Document not found
            </h1>
            <p className="text-gray-600 mb-6">The document you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/dashboard" 
              className="inline-flex items-center px-6 py-3 border-2 border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <button
            onClick={() => navigate('/dashboard')}
            className="group inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 mb-6 transition-all duration-200 hover:translate-x-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Dashboard
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1 animate-fade-in-up animation-delay-200">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 leading-tight">
                {document.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200/50 hover:bg-white/80 transition-all duration-200">
                  <User className="h-4 w-4 mr-2 text-indigo-500" />
                  <span className="font-medium">{document.createdBy.name}</span>
                </div>
                <div className="flex items-center bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200/50 hover:bg-white/80 transition-all duration-200">
                  <Clock className="h-4 w-4 mr-2 text-green-500" />
                  <span>Created {new Date(document.createdAt).toLocaleDateString()}</span>
                </div>
                {document.updatedAt !== document.createdAt && (
                  <div className="flex items-center bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200/50 hover:bg-white/80 transition-all duration-200">
                    <Clock className="h-4 w-4 mr-2 text-orange-500" />
                    <span>Updated {new Date(document.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 animate-fade-in-up animation-delay-300">
              <button
                onClick={() => setShowVersions(true)}
                className="group inline-flex items-center px-4 py-2.5 border-2 border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-white hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <History className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                History
              </button>
              
              {canEdit() && (
                <>
                  <Link
                    to={`/documents/${id}/edit`}
                    className="group inline-flex items-center px-4 py-2.5 border-2 border-indigo-200 text-sm font-semibold rounded-xl text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    <Edit className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                    Edit
                  </Link>
                  
                  <button
                    onClick={handleDelete}
                    className="group inline-flex items-center px-4 py-2.5 border-2 border-red-200 text-sm font-semibold rounded-xl text-red-700 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    <Trash2 className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in-up animation-delay-400">
          {/* Header Gradient */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-8">
            {/* Summary */}
            {document.summary && (
              <div className="mb-8 animate-fade-in-up animation-delay-500">
                <div className="relative p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/50 rounded-2xl overflow-hidden group hover:from-blue-100 hover:to-indigo-100 transition-all duration-300">
                  {/* Summary shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                    Summary
                  </h3>
                  <p className="text-blue-800 leading-relaxed font-medium">{document.summary}</p>
                </div>
              </div>
            )}

            {/* Tags */}
            {document.tags.length > 0 && (
              <div className="mb-8 animate-fade-in-up animation-delay-600">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {document.tags.map((tag, index) => (
                    <span
                      key={tag}
                      className="group/tag inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-gray-100 to-indigo-100 text-gray-800 border-2 border-gray-200 hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-300 transition-all duration-200 hover:scale-105 hover:shadow-lg animate-fade-in"
                      style={{ animationDelay: `${600 + index * 100}ms` }}
                    >
                      <Tag className="h-3 w-3 mr-2 text-indigo-600 group-hover/tag:rotate-12 transition-transform duration-200" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="animate-fade-in-up animation-delay-700">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                Content
              </h3>
              <div className="prose max-w-none">
                <div className="relative p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200/50 overflow-hidden group hover:border-gray-300 transition-all duration-300">
                  {/* Content shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  
                  <div className="relative whitespace-pre-wrap text-gray-900 leading-relaxed text-base">
                    {document.content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version History Modal */}
        {showVersions && (
          <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"></div>
              
              <div className="inline-block align-bottom bg-white/95 backdrop-blur-sm rounded-2xl px-6 pt-6 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full border border-white/20 animate-scale-in">
                {/* Modal Header Gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Version History
                    </h3>
                    <p className="text-gray-600 mt-1">Track changes and revisions</p>
                  </div>
                  <button
                    onClick={() => setShowVersions(false)}
                    className="group text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                  >
                    <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                </div>
                
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  <div className="space-y-4">
                    {versions.map((version, index) => (
                      <div 
                        key={version._id} 
                        className="group border-2 border-gray-200 rounded-xl p-5 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-indigo-50 hover:border-indigo-300 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-base font-bold text-gray-900 flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3 group-hover:animate-pulse"></div>
                            Version {version.versionNumber}
                            {index === 0 && (
                              <span className="ml-3 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-semibold animate-pulse">
                                Current
                              </span>
                            )}
                          </span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                            {new Date(version.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-base text-gray-800 font-medium line-clamp-2 mb-2">
                          {version.title}
                        </p>
                        {version.summary && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            {version.summary}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }

        /* Line clamp utility */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DocumentView;