import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Search, 
  Bot, 
  User, 
  Clock, 
  Tag,
  Sparkles
} from 'lucide-react';

const SearchPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [semanticResults, setSemanticResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('text'); // 'text' or 'semantic'
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetchAllTags();
  }, []);

  const fetchAllTags = async () => {
    try {
      const response = await axios.get('/documents');
      const docs = response.data.documents;
      const tags = new Set();
      docs.forEach(doc => {
        doc.tags.forEach(tag => tags.add(tag));
      });
      setAllTags([...tags]);
    } catch (error) {
      console.error('Failed to fetch tags');
    }
  };

  const handleTextSearch = async () => {
    if (!searchQuery.trim() && selectedTags.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery);
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));

      const response = await axios.get(`/search/text?${params}`);
      setSearchResults(response.data);
      setSemanticResults([]);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSemanticSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query for semantic search');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/search/semantic', { query: searchQuery });
      setSemanticResults(response.data);
      setSearchResults([]);
    } catch (error) {
      toast.error('Semantic search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchType === 'text') {
      handleTextSearch();
    } else {
      handleSemanticSearch();
    }
  };

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const results = searchType === 'text' ? searchResults : semanticResults;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Search Documents
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-4 animate-shimmer"></div>
          <p className="text-xl text-gray-600 font-medium">Find documents using text search or AI-powered semantic search</p>
        </div>

        {/* Search Interface */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 mb-10 animate-fade-in-up animation-delay-200 overflow-hidden relative">
          {/* Header Gradient */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          {/* Search Type Toggle */}
          <div className="flex space-x-4 mb-6 animate-fade-in-up animation-delay-300">
            <button
              onClick={() => setSearchType('text')}
              className={`group inline-flex items-center px-6 py-3 border-2 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                searchType === 'text'
                  ? 'border-indigo-300 text-indigo-700 bg-gradient-to-r from-indigo-50 to-blue-50 shadow-lg scale-105'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-indigo-300'
              }`}
            >
              <Search className={`h-4 w-4 mr-2 transition-transform duration-200 ${searchType === 'text' ? 'animate-pulse' : 'group-hover:scale-110'}`} />
              Text Search
            </button>
            <button
              onClick={() => setSearchType('semantic')}
              className={`group inline-flex items-center px-6 py-3 border-2 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                searchType === 'semantic'
                  ? 'border-purple-300 text-purple-700 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg scale-105'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-purple-300'
              }`}
            >
              <Bot className={`h-4 w-4 mr-2 transition-transform duration-200 ${searchType === 'semantic' ? 'animate-bounce' : 'group-hover:rotate-12'}`} />
              AI Semantic Search
            </button>
          </div>

          {/* Search Input */}
          <div className="flex space-x-4 mb-6 animate-fade-in-up animation-delay-400">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={
                  searchType === 'text' 
                    ? "Search in titles, content, and summaries..." 
                    : "Ask a question or describe what you're looking for..."
                }
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base transition-all duration-200 hover:border-gray-300 bg-gray-50/50 backdrop-blur-sm group-focus-within:bg-white"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-200 pointer-events-none"></div>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`group px-8 py-4 border-2 border-transparent text-sm font-semibold rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:hover:scale-100 relative overflow-hidden ${
                searchType === 'text'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:ring-indigo-500'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500'
              }`}
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              
              <div className="relative flex items-center">
                {loading ? (
                  <>
                    <div className="flex space-x-1 mr-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-100"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce animation-delay-200"></div>
                    </div>
                    Searching...
                  </>
                ) : (
                  <>
                    {searchType === 'text' ? (
                      <Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-200" />
                    )}
                    Search
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Tag Filters (only for text search) */}
          {searchType === 'text' && allTags.length > 0 && (
            <div className="animate-fade-in-up animation-delay-500">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Filter by Tags:
              </label>
              <div className="flex flex-wrap gap-3 p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-200/50">
                {allTags.map((tag, index) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`group/tag inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 animate-fade-in ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-2 border-indigo-300 shadow-lg scale-105'
                        : 'bg-white text-gray-800 border-2 border-gray-200 hover:bg-gradient-to-r hover:from-gray-100 hover:to-indigo-100 hover:border-indigo-300'
                    }`}
                    style={{ animationDelay: `${500 + index * 50}ms` }}
                  >
                    <Tag className={`h-3 w-3 mr-2 transition-transform duration-200 ${selectedTags.includes(tag) ? 'text-indigo-600 animate-pulse' : 'group-hover/tag:rotate-12'}`} />
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="mt-3 text-sm text-indigo-600 hover:text-indigo-500 font-medium hover:underline transition-all duration-200"
                >
                  Clear tag filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-8 animate-fade-in-up animation-delay-600">
            <div className="flex items-center justify-between bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent">
                Search Results ({results.length})
              </h2>
              {searchType === 'semantic' && (
                <div className="flex items-center text-sm font-semibold text-purple-600 bg-purple-50 px-4 py-2 rounded-xl border border-purple-200">
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Powered by AI
                </div>
              )}
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {results.map((doc, index) => (
                <div 
                  key={doc._id} 
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up overflow-hidden"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  {/* Card Header Gradient */}
                  <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:h-2 transition-all duration-300"></div>
                  
                  <div className="p-6 relative">
                    {/* Hover shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-100/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <Link to={`/documents/${doc._id}`}>
                            <h3 className="text-xl font-bold text-gray-900 hover:text-indigo-600 cursor-pointer transition-colors duration-200 group-hover:scale-[1.02] line-clamp-2">
                              {doc.title}
                              {searchType === 'semantic' && doc.similarity && (
                                <span className="ml-3 text-xs text-purple-600 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full font-bold border border-purple-200 animate-pulse">
                                  {Math.round(doc.similarity * 100)}% match
                                </span>
                              )}
                            </h3>
                          </Link>
                          
                          {doc.summary && (
                            <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
                              <p className="text-sm text-blue-800 font-medium line-clamp-3">
                                {doc.summary}
                              </p>
                            </div>
                          )}
                          
                          {doc.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {doc.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-gray-100 to-indigo-100 text-gray-800 border border-gray-200 hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 animate-fade-in"
                                  style={{ animationDelay: `${700 + index * 100 + tagIndex * 50}ms` }}
                                >
                                  {tag}
                                </span>
                              ))}
                              {doc.tags.length > 3 && (
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gray-200 text-gray-600">
                                  +{doc.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 space-x-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                          <User className="h-4 w-4 mr-2 text-indigo-500" />
                          <span className="font-medium">{doc.createdBy.name}</span>
                        </div>
                        <div className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                          <Clock className="h-4 w-4 mr-2 text-green-500" />
                          <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {(searchQuery || selectedTags.length > 0) && results.length === 0 && !loading && (
          <div className="text-center py-16 animate-fade-in-up animation-delay-400">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-indigo-400 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                <Search className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent mb-4">
                No results found
              </h3>
              <p className="text-gray-600 font-medium">
                Try adjusting your search query or filters
              </p>
            </div>
          </div>
        )}

        {/* Empty State - No Search Yet */}
        {!searchQuery && selectedTags.length === 0 && results.length === 0 && !loading && (
          <div className="text-center py-16 animate-fade-in-up animation-delay-400">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-12 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                {searchType === 'text' ? (
                  <Search className="h-12 w-12 text-white" />
                ) : (
                  <Bot className="h-12 w-12 text-white" />
                )}
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Ready to Search
              </h3>
              <p className="text-gray-600 font-medium mb-6">
                {searchType === 'text' 
                  ? "Enter keywords or select tags to find documents"
                  : "Ask questions in natural language to find relevant content"
                }
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>AI-powered search available</span>
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

        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }

        .animation-delay-50 {
          animation-delay: 0.05s;
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

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Line clamp utilities */
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

        /* Custom scrollbar */
        *::-webkit-scrollbar {
          width: 8px;
        }

        *::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }

        *::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #8b5cf6);
          border-radius: 4px;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #7c3aed);
        }
      `}</style>
    </div>
  );
};

export default SearchPage;