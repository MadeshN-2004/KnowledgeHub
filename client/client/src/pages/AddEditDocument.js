import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, ArrowLeft, Bot, Sparkles, X } from 'lucide-react';

const AddEditDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    summary: ''
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEditing) {
      fetchDocument();
    }
  }, [id, isEditing]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`/documents/${id}`);
      const doc = response.data;
      
      // Check if user can edit
      if (doc.createdBy._id !== user.id && user.role !== 'admin') {
        toast.error('You are not authorized to edit this document');
        navigate('/dashboard');
        return;
      }
      
      setFormData({
        title: doc.title,
        content: doc.content,
        tags: doc.tags,
        summary: doc.summary
      });
    } catch (error) {
      toast.error('Failed to fetch document');
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const generateSummary = async () => {
    if (!formData.content.trim()) {
      toast.error('Please add content first');
      return;
    }

    setAiLoading(true);
    try {
      const response = await axios.post('/ai/summarize', { content: formData.content });
      setFormData({
        ...formData,
        summary: response.data.summary
      });
      toast.success('Summary generated!');
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setAiLoading(false);
    }
  };

  const generateTags = async () => {
    if (!formData.content.trim()) {
      toast.error('Please add content first');
      return;
    }

    setAiLoading(true);
    try {
      const response = await axios.post('/ai/tags', { content: formData.content });
      const newTags = response.data.tags.filter(tag => !formData.tags.includes(tag));
      setFormData({
        ...formData,
        tags: [...formData.tags, ...newTags]
      });
      toast.success('Tags generated!');
    } catch (error) {
      toast.error('Failed to generate tags');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await axios.put(`/documents/${id}`, formData);
        toast.success('Document updated successfully!');
      } else {
        await axios.post('/documents', formData);
        toast.success('Document created successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        `Failed to ${isEditing ? 'update' : 'create'} document`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in-up">
          <button
            onClick={() => navigate('/dashboard')}
            className="group inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 mb-6 transition-all duration-200 hover:translate-x-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Dashboard
          </button>
          
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              {isEditing ? 'Edit Document' : 'Create New Document'}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-shimmer"></div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in-up animation-delay-200">
          {/* Header Gradient */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Title */}
            <div className="group animate-fade-in-up animation-delay-300">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors duration-200">
                Document Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200 hover:border-gray-300 bg-gray-50/50 backdrop-blur-sm"
                  placeholder="Enter a compelling document title..."
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </div>

            {/* Content */}
            <div className="group animate-fade-in-up animation-delay-400">
              <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-indigo-600 transition-colors duration-200">
                Content
              </label>
              <div className="relative">
                <textarea
                  name="content"
                  id="content"
                  required
                  rows={14}
                  value={formData.content}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200 hover:border-gray-300 bg-gray-50/50 backdrop-blur-sm resize-none"
                  placeholder="Write your document content here..."
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="group animate-fade-in-up animation-delay-500">
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="summary" className="block text-sm font-semibold text-gray-700 group-focus-within:text-indigo-600 transition-colors duration-200">
                  Summary
                </label>
                <button
                  type="button"
                  onClick={generateSummary}
                  disabled={aiLoading}
                  className="group/ai inline-flex items-center px-4 py-2 border-2 border-indigo-200 text-sm font-medium rounded-xl text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  <Bot className="h-4 w-4 mr-2 group-hover/ai:animate-bounce" />
                  {aiLoading ? (
                    <>
                      <span className="animate-pulse">Generating...</span>
                      <div className="ml-2 flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-100"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-200"></div>
                      </div>
                    </>
                  ) : (
                    'Generate with AI'
                  )}
                </button>
              </div>
              <div className="relative">
                <textarea
                  name="summary"
                  id="summary"
                  rows={4}
                  value={formData.summary}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200 hover:border-gray-300 bg-gray-50/50 backdrop-blur-sm resize-none"
                  placeholder="Document summary will appear here..."
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </div>

            {/* Tags */}
            <div className="animate-fade-in-up animation-delay-600">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Tags
                </label>
                <button
                  type="button"
                  onClick={generateTags}
                  disabled={aiLoading}
                  className="group/ai inline-flex items-center px-4 py-2 border-2 border-purple-200 text-sm font-medium rounded-xl text-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  <Sparkles className="h-4 w-4 mr-2 group-hover/ai:animate-spin" />
                  {aiLoading ? (
                    <>
                      <span className="animate-pulse">Generating...</span>
                      <div className="ml-2 flex space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-100"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce animation-delay-200"></div>
                      </div>
                    </>
                  ) : (
                    'Generate Tags'
                  )}
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition-all duration-200 hover:border-gray-300 bg-gray-50/50 backdrop-blur-sm group-focus-within:bg-white"
                      placeholder="Add a tag and press Enter..."
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-200 pointer-events-none"></div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-6 py-3 border-2 border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                  >
                    Add
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-3 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-100">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="group/tag inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200 hover:from-indigo-200 hover:to-purple-200 transition-all duration-200 hover:scale-105 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-indigo-600 hover:text-red-500 transition-colors duration-200 hover:bg-white rounded-full p-1 group-hover/tag:rotate-90"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 animate-fade-in-up animation-delay-700">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border-2 border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex items-center px-8 py-3 border-2 border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-2xl relative overflow-hidden"
              >
                {/* Button shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <Save className={`h-4 w-4 mr-2 transition-transform duration-200 ${loading ? 'animate-spin' : 'group-hover:scale-110'}`} />
                {loading 
                  ? (
                    <span className="flex items-center">
                      {isEditing ? 'Updating...' : 'Creating...'}
                      <div className="ml-2 flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-100"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-200"></div>
                      </div>
                    </span>
                  ) 
                  : (isEditing ? 'Update Document' : 'Create Document')
                }
              </button>
            </div>
          </form>
        </div>
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

        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
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

        /* Custom scrollbar for textareas */
        textarea::-webkit-scrollbar {
          width: 8px;
        }

        textarea::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        textarea::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 4px;
        }

        textarea::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }
      `}</style>
    </div>
  );
};

export default AddEditDocument;