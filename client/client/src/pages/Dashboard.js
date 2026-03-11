// Enhanced Dashboard.js with attractive modern design - FIXED
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  Clock, 
  User,
  Tag,
  Bot,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [showQA, setShowQA] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState({});

  useEffect(() => {
    fetchDocuments();
    fetchRecentActivity();
  }, []);

  useEffect(() => {
    // Extract all unique tags - with null check
    const tags = new Set();
    documents.forEach(doc => {
      if (doc.tags && Array.isArray(doc.tags)) {
        doc.tags.forEach(tag => tags.add(tag));
      }
    });
    setAllTags([...tags]);
  }, [documents]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get('/documents');
      setDocuments(response.data.documents);
    } catch (error) {
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await axios.get('/documents/activity');
      setRecentActivity(response.data);
    } catch (error) {
      if (error.response?.status === 429) {
        console.warn('Rate limit exceeded for recent activity - skipping for now');
        setRecentActivity([]); // Set empty array to avoid issues
      } else {
        console.error('Failed to fetch recent activity:', error);
      }
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await axios.delete(`/documents/${docId}`);
      toast.success('Document deleted successfully');
      fetchDocuments();
      fetchRecentActivity();
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const handleTagFilter = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filteredDocuments = selectedTags.length > 0
    ? documents.filter(doc => 
        doc.tags && selectedTags.some(tag => doc.tags.includes(tag))
      )
    : documents;

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setQaLoading(true);
    try {
      const response = await axios.post('/ai/question', { question });
      setAnswer(response.data.answer);
    } catch (error) {
      toast.error('Failed to get answer');
    } finally {
      setQaLoading(false);
    }
  };

  // Generate summary for existing document
  const handleGenerateSummary = async (docId) => {
    const doc = documents.find(d => d._id === docId);
    if (!doc) return;

    // Check permissions before attempting
    if (!canEdit(doc)) {
      toast.error('You don\'t have permission to edit this document');
      return;
    }

    setAiLoading(prev => ({ ...prev, [`summary-${docId}`]: true }));
    try {
      const response = await axios.post('/ai/summarize', { content: doc.content });
      
      // Use the new AI-specific route for updating summary
      await axios.put(`/ai/documents/${docId}/summary`, {
        summary: response.data.summary
      });
      
      toast.success('Summary generated and saved!');
      fetchDocuments();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('You don\'t have permission to edit this document');
      } else {
        toast.error('Failed to generate summary');
      }
    } finally {
      setAiLoading(prev => ({ ...prev, [`summary-${docId}`]: false }));
    }
  };

  // Generate tags for existing document
  const handleGenerateTags = async (docId) => {
    const doc = documents.find(d => d._id === docId);
    if (!doc) return;

    // Check permissions before attempting
    if (!canEdit(doc)) {
      toast.error('You don\'t have permission to edit this document');
      return;
    }

    setAiLoading(prev => ({ ...prev, [`tags-${docId}`]: true }));
    try {
      const response = await axios.post('/ai/tags', { content: doc.content });
      
      // Use the new AI-specific route for updating tags
      await axios.put(`/ai/documents/${docId}/tags`, {
        tags: response.data.tags
      });
      
      toast.success('Tags generated and saved!');
      fetchDocuments();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('You don\'t have permission to edit this document');
      } else {
        toast.error('Failed to generate tags');
      }
    } finally {
      setAiLoading(prev => ({ ...prev, [`tags-${docId}`]: false }));
    }
  };

  const canEdit = (doc) => {
    return user && user.role === 'admin' || (doc.createdBy && doc.createdBy._id === user.id);
  };

  // Fixed: Add null check for createdBy
  const userDocuments = documents.filter(doc => doc.createdBy && doc.createdBy._id === user.id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          </div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading your knowledge hub...</h2>
          <p className="text-gray-600">Preparing your documents and insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-2xl shadow-2xl text-white p-8 md:p-12 mb-12 overflow-hidden">
          {/* Geometric decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                  Welcome Back, {user && user.name ? user.name : 'User'}!
                </h1>
                <p className="text-indigo-200 text-lg">Your knowledge hub at a glance. Let's make today productive.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-8">
              <div className="group bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <p className="text-3xl font-bold mb-1">{documents.length}</p>
                <p className="text-indigo-200 text-sm font-medium">Total Docs</p>
              </div>
              <div className="group bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <User className="h-6 w-6 text-white" />
                </div>
                <p className="text-3xl font-bold mb-1">{userDocuments.length}</p>
                <p className="text-indigo-200 text-sm font-medium">Your Docs</p>
              </div>
              <div className="group bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Tag className="h-6 w-6 text-white" />
                </div>
                <p className="text-3xl font-bold mb-1">{allTags.length}</p>
                <p className="text-indigo-200 text-sm font-medium">Total Tags</p>
              </div>
              <div className="group bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <p className="text-3xl font-bold mb-1">{recentActivity.length}</p>
                <p className="text-indigo-200 text-sm font-medium">Recent Updates</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => setShowQA(!showQA)}
                className="group inline-flex items-center px-8 py-4 border border-white/30 text-sm font-medium rounded-xl text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="bg-white/20 rounded-lg p-1 mr-3 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-4 w-4" />
                </div>
                {showQA ? 'Hide' : 'Show'} Team Q&A
              </button>
              
              <Link
                to="/documents/new"
                className="group inline-flex items-center px-8 py-4 border border-transparent text-sm font-medium rounded-xl text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="bg-indigo-100 rounded-lg p-1 mr-3 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-4 w-4" />
                </div>
                New Document
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Q&A Section */}
            {showQA && (
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-2xl"></div>
                
                <h2 className="relative text-2xl font-bold text-gray-800 mb-8 flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl mr-4 shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Ask AI About Your Documents
                  </span>
                </h2>
                
                <div className="relative space-y-6">
                  <div className="relative">
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask a question about your team's documents..."
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm shadow-inner resize-none"
                      rows="4"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <button
                    onClick={handleAskQuestion}
                    disabled={qaLoading || !question.trim()}
                    className="group inline-flex items-center px-8 py-4 border border-transparent text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    {qaLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                        <span className="animate-pulse">AI is thinking...</span>
                      </>
                    ) : (
                      <>
                        <div className="bg-white/20 rounded-lg p-1 mr-3 group-hover:scale-110 transition-transform duration-300">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        Ask AI
                      </>
                    )}
                  </button>
                  
                  {answer && (
                    <div className="relative mt-8 p-8 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border-2 border-purple-200 rounded-2xl shadow-inner backdrop-blur-sm">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-2xl"></div>
                      <h3 className="relative font-bold text-purple-900 mb-4 flex items-center text-lg">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 rounded-lg mr-3">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        AI Answer:
                      </h3>
                      <div className="relative bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50">
                        <p className="text-purple-900 whitespace-pre-wrap leading-relaxed font-medium">{answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tag Filters */}
            {allTags.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-500">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3">
                    <Tag className="h-5 w-5 text-white" />
                  </div>
                  Filter by Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagFilter(tag)}
                      className={`group inline-flex items-center px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                        selectedTags.includes(tag)
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg border-2 border-indigo-300'
                          : 'bg-white/60 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 shadow-md'
                      }`}
                    >
                      <Tag className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                      {tag}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="mt-6 text-sm text-indigo-600 hover:text-indigo-500 font-semibold bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-all duration-200"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Documents Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl mr-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                Your Documents
              </h2>
              
              {/* Documents Grid */}
              <div className="grid gap-8 md:grid-cols-2">
                {filteredDocuments.map((doc, index) => (
                  <div 
                    key={doc._id} 
                    className="group relative bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-gray-100 hover:border-indigo-300 hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Card gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <Link to={`/documents/${doc._id}`}>
                            <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 cursor-pointer line-clamp-2 group-hover:text-indigo-600 transition-all duration-300">
                              {doc.title}
                            </h3>
                          </Link>
                          
                          {doc.summary && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-200">
                              <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed font-medium">
                                {doc.summary}
                              </p>
                            </div>
                          )}
                          
                          {doc.tags && doc.tags.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-2">
                              {doc.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-3 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 hover:from-indigo-200 hover:to-purple-200 transition-all duration-300 cursor-pointer transform hover:scale-110"
                                  onClick={() => handleTagFilter(tag)}
                                >
                                  {tag}
                                </span>
                              ))}
                              {doc.tags.length > 3 && (
                                <span className="text-xs text-gray-500 px-3 py-2 bg-gray-100 rounded-full font-medium">
                                  +{doc.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-8 space-x-6">
                        <div className="flex items-center group/author">
                          <div className="h-8 w-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-3 group-hover/author:scale-110 transition-transform duration-300">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-semibold">
                            {doc.createdBy && doc.createdBy.name ? doc.createdBy.name : 'Unknown User'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                          <span className="font-medium">{new Date(doc.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* AI Action Buttons - only show if user can edit */}
                      {canEdit(doc) && (
                        <div className="mb-6 flex flex-wrap gap-3">
                          <button
                            onClick={() => handleGenerateSummary(doc._id)}
                            disabled={aiLoading[`summary-${doc._id}`]}
                            className="group inline-flex items-center px-5 py-3 border border-transparent text-sm font-semibold rounded-xl text-indigo-700 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-md"
                          >
                            {aiLoading[`summary-${doc._id}`] ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-300 border-t-indigo-600 mr-3"></div>
                                <span className="animate-pulse">Generating...</span>
                              </>
                            ) : (
                              <>
                                <div className="bg-indigo-200 rounded-lg p-1 mr-3 group-hover:scale-110 transition-transform duration-300">
                                  <Bot className="h-3 w-3 text-indigo-700" />
                                </div>
                                Summarize with Gemini
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleGenerateTags(doc._id)}
                            disabled={aiLoading[`tags-${doc._id}`]}
                            className="group inline-flex items-center px-5 py-3 border border-transparent text-sm font-semibold rounded-xl text-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 focus:outline-none focus:ring-4 focus:ring-purple-500/30 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-md"
                          >
                            {aiLoading[`tags-${doc._id}`] ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-300 border-t-purple-600 mr-3"></div>
                                <span className="animate-pulse">Generating...</span>
                              </>
                            ) : (
                              <>
                                <div className="bg-purple-200 rounded-lg p-1 mr-3 group-hover:scale-110 transition-transform duration-300">
                                  <Sparkles className="h-3 w-3 text-purple-700" />
                                </div>
                                Generate Tags
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      
                      {/* Regular Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={`/documents/${doc._id}`}
                          className="group inline-flex items-center px-5 py-3 border-2 border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                          <div className="bg-gray-100 group-hover:bg-indigo-200 rounded-lg p-1 mr-3 group-hover:scale-110 transition-all duration-300">
                            <FileText className="h-4 w-4" />
                          </div>
                          View
                        </Link>
                        
                        {canEdit(doc) && (
                          <>
                            <Link
                              to={`/documents/${doc._id}/edit`}
                              className="group inline-flex items-center px-5 py-3 border-2 border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white/80 backdrop-blur-sm hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-500/30 transition-all duration-300 transform hover:scale-105 shadow-md"
                            >
                              <div className="bg-gray-100 group-hover:bg-yellow-200 rounded-lg p-1 mr-3 group-hover:scale-110 transition-all duration-300">
                                <Edit className="h-4 w-4" />
                              </div>
                              Edit
                            </Link>
                            
                            <button
                              onClick={() => handleDelete(doc._id)}
                              className="group inline-flex items-center px-5 py-3 border-2 border-red-200 text-sm font-semibold rounded-xl text-red-700 bg-red-50/80 backdrop-blur-sm hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-4 focus:ring-red-500/30 transition-all duration-300 transform hover:scale-105 shadow-md"
                            >
                              <div className="bg-red-200 rounded-lg p-1 mr-3 group-hover:scale-110 transition-transform duration-300">
                                <Trash2 className="h-4 w-4" />
                              </div>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDocuments.length === 0 && (
                <div className="text-center py-20">
                  <div className="relative">
                    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <FileText className="h-12 w-12 text-indigo-600" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full animate-ping"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {selectedTags.length > 0 ? 'No documents match the selected tags' : 'No documents yet'}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    {selectedTags.length > 0 
                      ? 'Try removing some tag filters or create a new document.'
                      : 'Get started by creating your first document and building your knowledge base.'
                    }
                  </p>
                  {selectedTags.length === 0 && (
                    <Link
                      to="/documents/new"
                      className="group inline-flex items-center px-8 py-4 border border-transparent shadow-xl text-sm font-semibold rounded-2xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="bg-white/20 rounded-lg p-1 mr-3 group-hover:scale-110 transition-transform duration-300">
                        <Plus className="h-5 w-5" />
                      </div>
                      Create your first document
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Team Activity Feed */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-500">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                Team Activity
              </h2>
              
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((doc, index) => (
                    <div 
                      key={doc._id} 
                      className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 border border-transparent hover:border-indigo-200 transform hover:scale-105"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/documents/${doc._id}`}
                          className="text-sm font-bold text-gray-900 hover:text-indigo-600 block truncate transition-colors duration-300"
                        >
                          {doc.title}
                        </Link>
                        <p className="text-xs text-gray-600 mt-1 font-medium">
                          Updated by {doc.createdBy && doc.createdBy.name ? doc.createdBy.name : 'Unknown User'}
                        </p>
                        <p className="text-xs text-gray-500 mt-2 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(doc.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-r from-gray-100 to-indigo-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <TrendingUp className="h-8 w-8 text-indigo-600" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">No recent activity</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-500">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Quick Stats
              </h2>
              <div className="space-y-4">
                <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all duration-300 transform hover:scale-105">
                  <span className="text-sm font-semibold text-gray-700">Total Documents</span>
                  <span className="text-xl font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm">{documents.length}</span>
                </div>
                <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 hover:border-indigo-300 transition-all duration-300 transform hover:scale-105">
                  <span className="text-sm font-semibold text-indigo-700">Your Documents</span>
                  <span className="text-xl font-bold text-indigo-600 bg-white px-3 py-1 rounded-lg shadow-sm">{userDocuments.length}</span>
                </div>
                <div className="group flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:border-purple-300 transition-all duration-300 transform hover:scale-105">
                  <span className="text-sm font-semibold text-purple-700">Total Tags</span>
                  <span className="text-xl font-bold text-purple-600 bg-white px-3 py-1 rounded-lg shadow-sm">{allTags.length}</span>
                </div>
              </div>
            </div>

            {/* Popular Tags */}
            {allTags.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-500">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3">
                    <Tag className="h-5 w-5 text-white" />
                  </div>
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {allTags.slice(0, 6).map((tag, index) => (
                    <span
                      key={tag}
                      className="group bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm font-semibold px-4 py-2.5 rounded-2xl cursor-pointer hover:from-indigo-200 hover:to-purple-200 transition-all duration-300 transform hover:scale-110 shadow-md border border-indigo-200 hover:border-indigo-300"
                      onClick={() => handleTagFilter(tag)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
        }
        
        .backdrop-blur {
          backdrop-filter: blur(16px);
        }
        
        /* Glassmorphism effect */
        .glass {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        /* Subtle animations */
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Hover glow effects */
        .hover-glow:hover {
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
        }
        
        /* Card entrance animations */
        .card-entrance {
          animation: cardEntrance 0.8s ease-out;
        }
        
        @keyframes cardEntrance {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;