// src/pages/Dashboard/DashboardPage.jsx - Cập nhật để bắt đầu với nhạc mặc định
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Coins, 
  Trophy, 
  TrendingUp, 
  Music, 
  Target,
  Calendar,
  Award,
  ArrowRight,
  Clock,
  Users,
  Zap,
  Library
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import { formatNumber, formatTime } from '../../utils/formatters';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Mock dashboard data (loại bỏ thông tin combo)
  const dashboardData = useMemo(() => ({
    stats: {
      totalCoins: user?.coins?.available || 1234.56,
      todayEarnings: 45.23,
      weeklyEarnings: 312.89,
      totalGames: user?.statistics?.totalGames || 89,
      bestScore: user?.statistics?.bestScore || 98765,
      currentLevel: user?.statistics?.level || 12,
      currentExp: user?.statistics?.experience || 2450,
      nextLevelExp: 3000,
      accuracy: user?.statistics?.accuracy || 87.5,
      totalPlayTime: user?.statistics?.totalPlayTime || 15420
    },
    recentGames: [
      {
        id: 1,
        musicTitle: "Piano Practice",
        artist: "BigCoin Piano",
        score: 9500,
        accuracy: 94.2,
        coinsEarned: 12.5,
        playedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isDefault: true
      },
      {
        id: 2,
        musicTitle: "Canon in D",
        artist: "Pachelbel",
        score: 8750,
        accuracy: 89.1,
        coinsEarned: 10.8,
        playedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isDefault: false
      },
      {
        id: 3,
        musicTitle: "Piano Practice",
        artist: "BigCoin Piano",
        score: 7200,
        accuracy: 76.5,
        coinsEarned: 8.2,
        playedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isDefault: true
      }
    ],
    achievements: [
      { id: 1, name: "Perfect Score", description: "Achieve 100% accuracy", progress: 94, total: 100, unlocked: false },
      { id: 2, name: "Key Master", description: "Press 1000 keys", progress: 850, total: 1000, unlocked: false },
      { id: 3, name: "Coin Master", description: "Earn 1000 BigCoins", progress: user?.coins?.total || 1234, total: 1000, unlocked: true }
    ],
    featured: [
      { id: 1, title: "Classical Masters", count: 25, image: "🎼" },
      { id: 2, title: "Popular Hits", count: 50, image: "🎵" },
      { id: 3, title: "Movie Soundtracks", count: 30, image: "🎬" }
    ]
  }), [user]);

  const stats = dashboardData?.stats || {};
  const levelProgress = (stats.currentExp / stats.nextLevelExp) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-gray-300 mt-1">Ready to earn some BigCoins?</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => navigate('/game')}
                className="bg-gradient-to-r from-green-600 to-emerald-600"
                icon={<Play className="w-5 h-5" />}
              >
                Quick Play
              </Button>
              <Button
                onClick={() => navigate('/music')}
                variant="outline"
                icon={<Library className="w-5 h-5" />}
              >
                Browse Music
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Coins */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-300 text-sm font-medium">Total BigCoins</p>
                    <p className="text-2xl font-bold text-white">{formatNumber(stats.totalCoins)}</p>
                    <p className="text-green-400 text-sm">+{formatNumber(stats.todayEarnings)} today</p>
                  </div>
                  <div className="p-3 bg-yellow-500/20 rounded-full">
                    <Coins className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
              </motion.div>

              {/* Best Score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm font-medium">Best Score</p>
                    <p className="text-2xl font-bold text-white">{formatNumber(stats.bestScore)}</p>
                    <p className="text-purple-400 text-sm">{stats.accuracy}% accuracy</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <Trophy className="w-8 h-8 text-purple-400" />
                  </div>
                </div>
              </motion.div>

              {/* Total Games */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">Games Played</p>
                    <p className="text-2xl font-bold text-white">{formatNumber(stats.totalGames)}</p>
                    <p className="text-blue-400 text-sm">{formatTime(stats.totalPlayTime)} total</p>
                  </div>
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <Music className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Level Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Level {stats.currentLevel}</h3>
                  <p className="text-gray-400">
                    {formatNumber(stats.nextLevelExp - stats.currentExp)} XP to next level
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full">
                  <Target className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatNumber(stats.currentExp)} XP</span>
                <span>{formatNumber(stats.nextLevelExp)} XP</span>
              </div>
            </motion.div>

            {/* Recent Games */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Recent Games</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/profile')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  View All
                </Button>
              </div>
              
              <div className="space-y-4">
                {dashboardData?.recentGames?.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-white">{game.musicTitle}</h4>
                          {game.isDefault && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{game.artist}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatTime((Date.now() - game.playedAt) / 1000)} ago
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-white">{formatNumber(game.score)}</p>
                      <p className="text-sm text-gray-400">{game.accuracy}% accuracy</p>
                      <p className="text-sm text-yellow-400">+{game.coinsEarned} BC</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  fullWidth
                  variant="primary"
                  onClick={() => navigate('/game')}
                  icon={<Play className="w-4 h-4" />}
                >
                  Quick Play (Default Music)
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => navigate('/music')}
                  icon={<Library className="w-4 h-4" />}
                >
                  Browse Music Library
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => navigate('/payment')}
                  icon={<Coins className="w-4 h-4" />}
                >
                  Withdraw Coins
                </Button>
                <Button
                  fullWidth
                  variant="ghost"
                  onClick={() => navigate('/leaderboard')}
                  icon={<Trophy className="w-4 h-4" />}
                >
                  Leaderboard
                </Button>
              </div>
            </motion.div>

            {/* Game Tip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30"
            >
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 text-yellow-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Pro Tip</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Each key press earns you 10 BigCoins! Focus on accuracy and speed to maximize your earnings.
              </p>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-yellow-400 text-xs font-medium mb-1">Current Rate:</div>
                <div className="text-white text-lg font-bold">10 BC per key press</div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Achievements</h3>
                <Award className="w-5 h-5 text-yellow-400" />
              </div>
              
              <div className="space-y-4">
                {dashboardData?.achievements?.map((achievement) => (
                  <div key={achievement.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${achievement.unlocked ? 'text-yellow-400' : 'text-white'}`}>
                        {achievement.name} {achievement.unlocked && '🏆'}
                      </h4>
                      <span className="text-sm text-gray-400">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          achievement.unlocked 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500'
                        }`}
                        style={{ width: `${Math.min((achievement.progress / achievement.total) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                fullWidth
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => navigate('/profile')}
              >
                View All Achievements
              </Button>
            </motion.div>

            {/* Featured Collections */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Featured Collections</h3>
              <div className="space-y-3">
                {dashboardData?.featured?.map((collection) => (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/music')}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{collection.image}</span>
                      <div>
                        <h4 className="font-medium text-white">{collection.title}</h4>
                        <p className="text-sm text-gray-400">{collection.count} songs</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-green-600/20 border border-green-600/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Play className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium text-sm">Quick Start</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Don't want to choose? Click "Quick Play" to start earning with our default practice track immediately!
                </p>
                <Button
                  fullWidth
                  size="sm"
                  onClick={() => navigate('/game')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start Earning Now
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;