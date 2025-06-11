// client/src/pages/Music/MusicLibraryPage.jsx - Music library and browse page
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Play, 
  Heart, 
  Star, 
  Clock, 
  TrendingUp, 
  Music,
  Crown,
  Zap,
  Users,
  ChevronDown,
  Grid,
  List
} from 'lucide-react';

import { musicService } from '@services/musicService';
import { useAuth } from '@contexts/AuthContext';
import Button from '@components/UI/Button';
import LoadingSpinner from '@components/UI/LoadingSpinner';
import { formatTime, formatNumber } from '@utils/formatters';

// Music Card Component
const MusicCard = ({ music, onPlay, onLike, isLiked, viewMode = 'grid' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const difficultyColors = {
    easy: 'text-green-400 bg-green-400/20',
    medium: 'text-yellow-400 bg-yellow-400/20',
    hard: 'text-orange-400 bg-orange-400/20',
    expert: 'text-red-400 bg-red-400/20'
  };

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
            {music.availability?.premium && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-yellow-900" />
              </div>
            )}
          </div>

          {/* Music Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate">{music.title}</h3>
            <p className="text-gray-400 truncate">{music.artist}</p>
            <div className="flex items-center space-x-4 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[music.difficulty.level]}`}>
                {music.difficulty.level.toUpperCase()}
              </span>
              <span className="text-gray-500 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatTime(music.duration)}
              </span>
              <span className="text-gray-500 text-sm flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {formatNumber(music.statistics.playCount)}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="text-right">
            <div className="flex items-center justify-end text-yellow-400 mb-1">
              <Star className="w-4 h-4 mr-1" />
              <span className="text-sm">{(music.statistics.averageScore / 1000).toFixed(1)}k</span>
            </div>
            <div className="text-gray-400 text-sm">
              {music.statistics.averageAccuracy.toFixed(1)}% accuracy
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
        {music.availability?.premium && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
            <Crown className="w-4 h-4 text-yellow-900" />
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
            {formatNumber(music.statistics.playCount)}
          </span>
        </div>

        {/* Difficulty & Rating */}
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[music.difficulty.level]}`}>
            {music.difficulty.level.toUpperCase()}
          </span>
          <div className="flex items-center text-yellow-400">
            <Star className="w-4 h-4 mr-1" />
            <span className="text-sm">{(music.statistics.averageScore / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Filter Sidebar Component
const FilterSidebar = ({ filters, onFilterChange, isOpen, onClose }) => {
  const genres = [
    'pop', 'rock', 'jazz', 'classical', 'electronic', 'hip-hop',
    'country', 'folk', 'blues', 'reggae', 'metal', 'punk'
  ];

  const difficulties = ['easy', 'medium', 'hard', 'expert'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-80 bg-gray-800/95 backdrop-blur-sm border-r border-gray-700 z-50 lg:relative lg:w-64 lg:bg-gray-800/50"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 lg:justify-start">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white lg:hidden"
                >
                  ×
                </button>
              </div>

              {/* Genre Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Genre</h4>
                <div className="space-y-2">
                  {genres.map(genre => (
                    <label key={genre} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={filters.genres.includes(genre)}
                        onChange={(e) => {
                          const newGenres = e.target.checked
                            ? [...filters.genres, genre]
                            : filters.genres.filter(g => g !== genre);
                          onFilterChange({ ...filters, genres: newGenres });
                        }}
                        className="mr-2 rounded border-gray-600 bg-gray-700 text-blue-500"
                      />
                      <span className="text-gray-300 capitalize">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Difficulty</h4>
                <div className="space-y-2">
                  {difficulties.map(difficulty => (
                    <label key={difficulty} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={filters.difficulties.includes(difficulty)}
                        onChange={(e) => {
                          const newDifficulties = e.target.checked
                            ? [...filters.difficulties, difficulty]
                            : filters.difficulties.filter(d => d !== difficulty);
                          onFilterChange({ ...filters, difficulties: newDifficulties });
                        }}
                        className="mr-2 rounded border-gray-600 bg-gray-700 text-blue-500"
                      />
                      <span className="text-gray-300 capitalize">{difficulty}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Duration</h4>
                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="duration"
                      checked={filters.duration === 'short'}
                      onChange={() => onFilterChange({ ...filters, duration: 'short' })}
                      className="mr-2 border-gray-600 bg-gray-700 text-blue-500"
                    />
                    <span className="text-gray-300">Short (1-3 min)</span>
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="duration"
                      checked={filters.duration === 'medium'}
                      onChange={() => onFilterChange({ ...filters, duration: 'medium' })}
                      className="mr-2 border-gray-600 bg-gray-700 text-blue-500"
                    />
                    <span className="text-gray-300">Medium (3-5 min)</span>
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="duration"
                      checked={filters.duration === 'long'}
                      onChange={() => onFilterChange({ ...filters, duration: 'long' })}
                      className="mr-2 border-gray-600 bg-gray-700 text-blue-500"
                    />
                    <span className="text-gray-300">Long (5+ min)</span>
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="duration"
                      checked={filters.duration === ''}
                      onChange={() => onFilterChange({ ...filters, duration: '' })}
                      className="mr-2 border-gray-600 bg-gray-700 text-blue-500"
                    />
                    <span className="text-gray-300">Any</span>
                  </label>
                </div>
              </div>

              {/* Premium Filter */}
              <div className="mb-6">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={filters.premiumOnly}
                    onChange={(e) => onFilterChange({ ...filters, premiumOnly: e.target.checked })}
                    className="mr-2 rounded border-gray-600 bg-gray-700 text-blue-500"
                  />
                  <span className="text-gray-300 flex items-center">
                    <Crown className="w-4 h-4 mr-1 text-yellow-500" />
                    Premium Only
                  </span>
                </label>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFilterChange({
                  genres: [],
                  difficulties: [],
                  duration: '',
                  premiumOnly: false
                })}
                className="w-full"
              >
                Clear All Filters
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Main Music Library Page
const MusicLibraryPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set());
  const [filters, setFilters] = useState({
    genres: [],
    difficulties: [],
    duration: '',
    premiumOnly: false
  });

  // Fetch music data
  const { 
    data: musicData, 
    isLoading, 
    error 
  } = useQuery(
    ['music', { 
      q: searchQuery, 
      sort: sortBy, 
      filters,
      page: 1,
      limit: 50 
    }],
    () => musicService.searchMusic({
      q: searchQuery,
      sort: sortBy,
      ...filters,
      page: 1,
      limit: 50
    }),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000
    }
  );

  // Fetch trending music
  const { data: trendingData } = useQuery(
    'trendingMusic',
    () => musicService.getTrendingMusic(),
    { staleTime: 5 * 60 * 1000 }
  );

  // Fetch featured music
  const { data: featuredData } = useQuery(
    'featuredMusic',
    () => musicService.getFeaturedMusic(),
    { staleTime: 10 * 60 * 1000 }
  );

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  // Handle like/unlike
  const handleLike = async (musicId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await musicService.toggleLike(musicId);
      setLikedSongs(prev => {
        const newSet = new Set(prev);
        if (newSet.has(musicId)) {
          newSet.delete(musicId);
        } else {
          newSet.add(musicId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  // Filter music based on current filters
  const filteredMusic = useMemo(() => {
    if (!musicData?.music) return [];
    
    return musicData.music.filter(music => {
      // Genre filter
      if (filters.genres.length > 0 && !filters.genres.includes(music.genre)) {
        return false;
      }
      
      // Difficulty filter
      if (filters.difficulties.length > 0 && !filters.difficulties.includes(music.difficulty.level)) {
        return false;
      }
      
      // Duration filter
      if (filters.duration) {
        const duration = music.duration;
        switch (filters.duration) {
          case 'short':
            if (duration > 180) return false;
            break;
          case 'medium':
            if (duration <= 180 || duration > 300) return false;
            break;
          case 'long':
            if (duration <= 300) return false;
            break;
        }
      }
      
      // Premium filter
      if (filters.premiumOnly && !music.availability?.premium) {
        return false;
      }
      
      return true;
    });
  }, [musicData?.music, filters]);

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
                  placeholder="Search songs, artists..."
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
                  <option value="difficulty">Difficulty</option>
                  <option value="duration">Duration</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar Filters */}
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            isOpen={true}
            onClose={() => {}}
          />
        </div>

        {/* Mobile Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* Featured Section */}
          {!searchQuery && featuredData?.featured && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Featured
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredData.featured.slice(0, 4).map(music => (
                  <MusicCard
                    key={music._id}
                    music={music}
                    onLike={handleLike}
                    isLiked={likedSongs.has(music._id)}
                    viewMode="grid"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Trending Section */}
          {!searchQuery && trendingData?.trending && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Trending Now
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {trendingData.trending.slice(0, 4).map(item => (
                  <MusicCard
                    key={item.music._id}
                    music={item.music}
                    onLike={handleLike}
                    isLiked={likedSongs.has(item.music._id)}
                    viewMode="grid"
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Music / Search Results */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Music'}
              </h2>
              <span className="text-gray-400 text-sm">
                {filteredMusic.length} songs
              </span>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-gray-400">Failed to load music. Please try again.</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredMusic.length === 0 && (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No music found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Music Grid/List */}
            {!isLoading && !error && filteredMusic.length > 0 && (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "space-y-4"
              }>
                {filteredMusic.map(music => (
                  <MusicCard
                    key={music._id}
                    music={music}
                    onLike={handleLike}
                    isLiked={likedSongs.has(music._id)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MusicLibraryPage;