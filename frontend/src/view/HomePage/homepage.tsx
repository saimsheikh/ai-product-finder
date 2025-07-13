import React, { useState, useEffect } from 'react';
import GeneratedFilters from '../../components/FilterBox/filterbox';
import ProductDisplay from '../../components/ProductCard/product_card';

const HomePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleGoClick = async () => {
    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }

    setResults(null);
    setProducts([]);
    setLoading(true);
    setStatus('Connecting to WebSocket...');
    setShowResults(true);

    try {
      // Fetch filters from the API
      const response = await fetch('http://127.0.0.1:8001/detect-filters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch filters');
      }

      const data = await response.json();
      setResults(data[0]);

      // Establish WebSocket connection after receiving the data from the API
      const ws = new WebSocket('ws://127.0.0.1:8001/ws/get-data');

      ws.onopen = () => {
        console.log('Connected to WebSocket');
        ws.send(JSON.stringify(data[0])); // Send filters to WebSocket server
        setStatus("WebSocket connection opened...")
      };

      ws.onmessage = (event) => {
        const message = event.data;

        // Check if it's a status message (plain text)
        if (typeof message === 'string' && !message.startsWith('{')) {
          if (message === 'starting scraping...') {
            setStatus('Starting scraping...');
          } else if (message === 'searching product...') {
            setStatus('Searching products...');
          } else if (message === 'scraping filters...') {
            setStatus('Scraping filters...');
          } else if (message === 'Applying filters...') {
            setStatus('Applying filters...');
          } else if (message === 'scraping products...') {
            setStatus('Scraping products...');
          } else if (message === 'Scraping completed!') {
            setStatus('Scraping completed!');
            setLoading(false);
          } else {
            setStatus(message);
          }
        } else {
          // Handle product data (JSON)
          try {
            const product = JSON.parse(message);
            console.log(product);
            setProducts((prevProducts) => [...prevProducts, product]);
          } catch (error) {
            console.error('Error parsing product data:', error);
          }
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('Connection error occurred');
        setLoading(false);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setStatus('Scraping completed!');
        setLoading(false);
      };
    } catch (error) {
      console.error('Error:', error);
      setStatus('An error occurred while processing your request');
      setLoading(false);
    }
  };

  // Refresh button handler to reset the process
  const handleRefresh = () => {
    setQuery('');
    setResults(null);
    setProducts([]);
    setStatus('');
    setShowResults(false);
  };

  // Handle input change with typing animation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGoClick();
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="text-center w-full max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight drop-shadow-lg animate-fade-in">
              AI Product Finder
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in animation-delay-300">
              Discover products with intelligent filtering powered by AI
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto w-full">
              <div className={`relative flex items-center bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl shadow-2xl transition-all duration-300 ${isTyping ? 'scale-105 shadow-purple-200' : ''}`}>
                <div className="absolute left-4 text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe what you're looking for..."
                  className="w-full pl-12 pr-24 py-4 text-lg text-gray-700 bg-transparent focus:outline-none focus:ring-0 rounded-2xl transition-all"
                />
                <button
                  onClick={handleGoClick}
                  disabled={loading}
                  className={`absolute right-2 px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Status Section */}
          {status && (
            <div className={`mb-8 p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200 transition-all duration-500 ${showResults ? 'animate-slide-up' : ''}`}>
              <div className="flex items-center justify-center space-x-3">
                {loading && (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce animation-delay-100"></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce animation-delay-200"></div>
                  </div>
                )}
                <span className={`text-lg font-medium ${loading ? 'text-purple-600' : 'text-green-600'}`}>
                  {status}
                </span>
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className={`transition-all duration-700 ${showResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Generated Filters */}
            {results && (
              <div className="mb-8 animate-fade-in">
                <GeneratedFilters results={results} />
              </div>
            )}

            {/* Products Display */}
            {products.length > 0 && (
              <div className="mb-8 animate-fade-in animation-delay-500">
                <ProductDisplay products={products} />
              </div>
            )}

            {/* Action Buttons */}
            {(results || products.length > 0) && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-700">
                <button
                  onClick={handleRefresh}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  New Search
                </button>
                
                {products.length > 0 && (
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    Back to Top
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
