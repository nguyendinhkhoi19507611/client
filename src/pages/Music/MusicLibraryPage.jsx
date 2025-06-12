// Music library and browse page - simplified version
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
            {formatNumber(music.statistics.playCount)}
          </span>
        </div>

        {/* Genre & Rating */}
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
            {music.genre.toUpperCase()}
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

// Main Music Library Page
const MusicLibraryPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { searchMusic, getFeaturedMusic, getTrendingMusic } = useGame();

  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popularity');
  const [likedSongs, setLikedSongs] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

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

  // Filter music based on search query
  const filteredMusic = useMemo(() => {
    const searchResult = searchMusic({ q: searchQuery });
    let results = searchResult.music;
    
    // Sort results
    results.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.statistics.playCount - a.statistics.playCount;
        case 'newest':
          return b._id.localeCompare(a._id); // Mock newest based on ID
        case 'duration':
          return a.duration - b.duration;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    
    return results;
  }, [searchQuery, sortBy, searchMusic]);

  // Get featured music
  const featuredMusic = useMemo(() => {
    return getFeaturedMusic().slice(0, 4);
  }, [getFeaturedMusic]);

  // Get trending music
  const trendingMusic = useMemo(() => {
    return getTrendingMusic().slice(0, 4);
  }, [getTrendingMusic]);

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
        {/* Featured Section */}
        {!searchQuery && featuredMusic.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Featured
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredMusic.map(music => (
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
        {!searchQuery && trendingMusic.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Trending Now
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingMusic.map(music => (
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

          {/* Empty State */}
          {!isLoading && filteredMusic.length === 0 && (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No music found</p>
              <p className="text-gray-500 text-sm">Try a different search term</p>
            </div>
          )}

          {/* Music Grid/List */}
          {!isLoading && filteredMusic.length > 0 && (
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
  );
};

export default MusicLibraryPage;