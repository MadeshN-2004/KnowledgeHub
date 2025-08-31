import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Search, 
  Bot, 
  FileText, 
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search Documents</h1>
        <p className="mt-2 text-gray-600">Find documents using text search or AI-powered semantic search</p>
      </div>

      {/* Search Interface */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        {/* Search Type Toggle */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setSearchType('text')}
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
              searchType === 'text'
                ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Search className="h-4 w-4 mr-2" />
            Text Search
          </button>
          <button
            onClick={() => setSearchType('semantic')}
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors ${
              searchType === 'semantic'
                ? 'border-purple-500 text-purple-700 bg-purple-50'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Bot className="h-4 w-4 mr-2" />
            AI Semantic Search
          </button>
        </div>

        {/* Search Input */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              searchType === 'text'
                ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
            }`}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Tag Filters (only for text search) */}
        {searchType === 'text' && allTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Tags:
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
              >
                Clear tag filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results ({results.length})
            </h2>
            {searchType === 'semantic' && (
              <div className="flex items-center text-sm text-purple-600">
                <Sparkles className="h-4 w-4 mr-1" />
                Powered by AI
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {results.map((doc) => (
              <div key={doc._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link to={`/documents/${doc._id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer">
                          {doc.title}
                          {searchType === 'semantic' && doc.similarity && (
                            <span className="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                              {Math.round(doc.similarity * 100)}% match
                            </span>
                          )}
                        </h3>
                      </Link>
                      
                      {doc.summary && (
                        <p className="mt-2 text-sm text-gray-600">
                          {doc.summary}
                        </p>
                      )}
                      
                      {doc.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {doc.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    <span>{doc.createdBy.name}</span>
                    <Clock className="h-4 w-4 ml-4 mr-1" />
                    <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {(searchQuery || selectedTags.length > 0) && results.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search query or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;