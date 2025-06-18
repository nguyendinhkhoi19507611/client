// src/pages/Music/MusicLibraryPage.jsx - Fixed pagination
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Play, 
  Heart, 
  Star, 
  Clock, 
  TrendingUp, 
  Music,
  Users,
  Grid,
  List
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { formatTime, formatNumber } from '../../utils/formatters';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Pagination from '../../components/UI/Pagination';
import { useDebounce } from '../../hooks/useDebounce';

// Music Card Component - simplified without difficulty
const MusicCard = ({ music, onPlay, onLike, isLiked, viewMode = 'grid' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlay = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/game?music=${music._id}`);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300"
      >
        <div className="flex items-center space-x-4">
          {/* Album Art */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
            <Music className="w-8 h-8 text-white" />
            {music.trending && (
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Music Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">{music.title}</h3>
            <p className="text-gray-400 truncate">{music.artist}</p>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-gray-500 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(music.duration)}
              </span>
              <span className="text-gray-500 text-sm flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {formatNumber(music.statistics?.playCount || 0)}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="text-right">
            <div className="flex items-center justify-end text-yellow-400 mb-1">
              <Star className="w-4 h-4 mr-1" />
              <span className="text-sm">{((music.statistics?.averageScore || 0) / 1000).toFixed(1)}k</span>
            </div>
            <div className="text-gray-400 text-sm">
              {music.genre}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(music._id)}
              className={isLiked ? 'text-red-400' : 'text-gray-400'}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              size="sm"
              onClick={handlePlay}
              className="bg-gradient-to-r from-green-600 to-emerald-600"
            >
              <Play className="w-4 h-4 mr-1" />
              Play
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300"
    >
      {/* Album Art */}
      <div className="relative aspect-square bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <Music className="w-16 h-16 text-white" />
        
        {music.trending && (
          <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            size="lg"
            onClick={handlePlay}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
          >
            <Play className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-white truncate">{music.title}</h3>
            <p className="text-gray-400 truncate">{music.artist}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(music._id)}
            className={`shrink-0 ${isLiked ? 'text-red-400' : 'text-gray-400'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {formatTime(music.duration)}
          </span>
          <span className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            {formatNumber(music.statistics?.playCount || 0)}
          </span>
        </div>

        {/* Genre & Rating */}
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
            {music.genre?.toUpperCase() || 'MUSIC'}
          </span>
          <div className="flex items-center text-yellow-400">
            <Star className="w-4 h-4 mr-1" />
            <span className="text-sm">{((music.statistics?.averageScore || 0) / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Music Library Page
const MusicLibraryPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { searchMusic } = useGame();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(searchParams.get('size')) || 12);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Other state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [likedSongs, setLikedSongs] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [musicData, setMusicData] = useState([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Update URL when pagination or search changes
  const updateURLParams = (page = currentPage, size = itemsPerPage, query = searchQuery) => {
    const params = new URLSearchParams();
    
    if (query.trim()) {
      params.set('q', query.trim());
    }
    
    if (page > 1) {
      params.set('page', page.toString());
    }
    
    if (size !== 12) {
      params.set('size', size.toString());
    }

    console.log(`Updating URL params: page=${page}, size=${size}, query="${query}"`);
    setSearchParams(params, { replace: true });
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search submitted:', searchQuery);
    setCurrentPage(1);
    updateURLParams(1, itemsPerPage, searchQuery);
  };

  // Handle page change
  const handlePageChange = (page) => {
    console.log('Page changed to:', page);
    setCurrentPage(page);
    updateURLParams(page, itemsPerPage, searchQuery);
    
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    console.log('Page size changed to:', size);
    setItemsPerPage(size);
    setCurrentPage(1);
    updateURLParams(1, size, searchQuery);
  };

  // Handle like/unlike
  const handleLike = async (musicId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLikedSongs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(musicId)) {
        newSet.delete(musicId);
      } else {
        newSet.add(musicId);
      }
      return newSet;
    });
  };

  // Fetch music data with proper pagination
  useEffect(() => {
    const fetchMusic = async () => {
      setIsLoading(true);
      
      try {
        console.log(`Fetching music: query="${debouncedSearchQuery}", page=${currentPage}, limit=${itemsPerPage}, sort=${sortBy}`);
        
        const searchResult = await searchMusic({ 
          q: debouncedSearchQuery,
          page: currentPage,
          limit: itemsPerPage,
          sort: sortBy
        });

        console.log('API Response:', searchResult);

        // Extract data from API response
        let musicList = searchResult.music || [];
        const apiTotal = searchResult.totalItems;
        
        // If API doesn't handle pagination properly, do client-side pagination
        const needsClientPagination = !apiTotal || musicList.length > itemsPerPage;
        
        if (needsClientPagination) {
          console.log('Applying client-side pagination');
          
          // Apply client-side sorting first
          const allMusic = [...musicList].sort((a, b) => {
            switch (sortBy) {
              case 'popularity':
                return (b.statistics?.playCount || 0) - (a.statistics?.playCount || 0);
              case 'newest':
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
              case 'duration':
                return (a.duration || 0) - (b.duration || 0);
              case 'alphabetical':
                return (a.title || '').localeCompare(b.title || '');
              default:
                return 0;
            }
          });
          
          // Apply client-side pagination
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedMusic = allMusic.slice(startIndex, endIndex);
          
          setMusicData(paginatedMusic);
          setTotalItems(allMusic.length);
          setTotalPages(Math.ceil(allMusic.length / itemsPerPage));
          
          console.log(`Client pagination: showing ${paginatedMusic.length} of ${allMusic.length} songs, page ${currentPage}`);
        } else {
          // API handles pagination properly
          const sortedMusic = [...musicList].sort((a, b) => {
            switch (sortBy) {
              case 'popularity':
                return (b.statistics?.playCount || 0) - (a.statistics?.playCount || 0);
              case 'newest':
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
              case 'duration':
                return (a.duration || 0) - (b.duration || 0);
              case 'alphabetical':
                return (a.title || '').localeCompare(b.title || '');
              default:
                return 0;
            }
          });
          
          setMusicData(sortedMusic);
          setTotalItems(apiTotal);
          setTotalPages(Math.ceil(apiTotal / itemsPerPage));
          
          console.log(`API pagination: showing ${sortedMusic.length} songs, total: ${apiTotal}`);
        }

      } catch (error) {
        console.error('Error fetching music:', error);
        setMusicData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusic();
  }, [debouncedSearchQuery, currentPage, itemsPerPage, sortBy, searchMusic]);

  // Update pagination when URL params change
  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    const size = parseInt(searchParams.get('size')) || 12;
    const query = searchParams.get('q') || '';
    
    if (page !== currentPage) setCurrentPage(page);
    if (size !== itemsPerPage) setItemsPerPage(size);
    if (query !== searchQuery) setSearchQuery(query);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Music Library</h1>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by song title or artist..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </form>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 appearance-none pr-8"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="alphabetical">A-Z</option>
                  <option value="duration">Duration</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Results Header */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Music'}
            </h2>
            
            {/* Results count and pagination info */}
            <div className="text-gray-400 text-sm">
              {isLoading ? (
                'Loading...'
              ) : (
                `Showing ${musicData.length} of ${totalItems} songs • Page ${currentPage}/${totalPages}`
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* No Results */}
          {!isLoading && musicData.length === 0 && (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No music found</p>
              <p className="text-gray-500 text-sm">
                {searchQuery ? 'Try a different search term' : 'No music available'}
              </p>
            </div>
          )}

          {/* Music Grid/List */}
          {!isLoading && musicData.length > 0 && (
            <>
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8" 
                  : "space-y-4 mb-8"
              }>
                <AnimatePresence mode="wait">
                  {musicData.map((music, index) => (
                    <motion.div
                      key={`${music._id}-${currentPage}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <MusicCard
                        music={music}
                        onLike={handleLike}
                        isLiked={likedSongs.has(music._id)}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination - Only show if there are multiple pages */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  pageSizeOptions={[12, 24, 48]}
                  className="border-t border-gray-700 pt-6"
                />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default MusicLibraryPage;