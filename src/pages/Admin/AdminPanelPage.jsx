// src/pages/Admin/AdminPanelPage.jsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Music, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Settings,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  Plus,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { formatNumber, formatCurrency, formatTime } from '../../utils/formatters';

const AdminPanelPage = () => {
  const { user, mockUsers } = useAuth();
  const { t, formatRelativeTime } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock admin data
  const adminData = useMemo(() => ({
    overview: {
      totalUsers: 15420,
      activeUsers: 3245,
      totalRevenue: 125000,
      pendingWithdrawals: 8450,
      totalGames: 89560,
      totalSongs: 1234,
      avgSessionTime: 1245,
      conversionRate: 12.5
    },
    recentUsers: mockUsers.slice(0, 10),
    recentTransactions: [
      {
        id: 'tx_001',
        userId: '1',
        username: 'demo',
        type: 'withdrawal',
        amount: 100,
        currency: 'USD',
        status: 'pending',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 'tx_002',
        userId: '3',
        username: 'user_vn',
        type: 'earning',
        amount: 25.5,
        currency: 'BIGCOIN',
        status: 'completed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'tx_003',
        userId: '1',
        username: 'demo',
        type: 'earning',
        amount: 15.75,
        currency: 'BIGCOIN',
        status: 'completed',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      }
    ],
    systemStats: {
      serverUptime: 99.9,
      apiResponseTime: 125,
      activeConnections: 2456,
      errorRate: 0.02
    },
    musicStats: {
      totalPlays: 456789,
      popularGenres: [
        { genre: 'Pop', plays: 125000, percentage: 35 },
        { genre: 'Classical', plays: 89000, percentage: 25 },
        { genre: 'Rock', plays: 75000, percentage: 21 },
        { genre: 'Jazz', plays: 45000, percentage: 12 },
        { genre: 'Electronic', plays: 25000, percentage: 7 }
      ],
      topSongs: [
        { id: '1', title: 'Für Elise', artist: 'Beethoven', plays: 12500 },
        { id: '5', title: 'Imagine', artist: 'John Lennon', plays: 11200 },
        { id: '7', title: 'Shape of You', artist: 'Ed Sheeran', plays: 10800 }
      ]
    }
  }), [mockUsers]);

  const filteredUsers = useMemo(() => {
    return adminData.recentUsers.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [adminData.recentUsers, searchQuery]);

  // User Management Functions
  const handleViewUser = (userData) => {
    setSelectedUser(userData);
    setShowUserModal(true);
  };

  const handleBanUser = (userId) => {
    // Mock ban user function
    console.log('Banning user:', userId);
  };

  const handleDeleteUser = (userId) => {
    // Mock delete user function
    console.log('Deleting user:', userId);
  };

  // Render Overview Tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">{t('admin.totalUsers')}</p>
              <p className="text-3xl font-bold">{formatNumber(adminData.overview.totalUsers)}</p>
              <p className="text-blue-200 text-xs mt-1">+12% vs last month</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">{t('admin.totalRevenue')}</p>
              <p className="text-3xl font-bold">{formatCurrency(adminData.overview.totalRevenue)}</p>
              <p className="text-green-200 text-xs mt-1">+8% vs last month</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">{t('admin.activeUsers')}</p>
              <p className="text-3xl font-bold">{formatNumber(adminData.overview.activeUsers)}</p>
              <p className="text-purple-200 text-xs mt-1">+15% vs last week</p>
            </div>
            <Activity className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">{t('admin.pendingWithdrawals')}</p>
              <p className="text-3xl font-bold">{formatCurrency(adminData.overview.pendingWithdrawals)}</p>
              <p className="text-orange-200 text-xs mt-1">23 requests</p>
            </div>
            <Clock className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            User Growth
          </h3>
          <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Chart Placeholder - User Growth Over Time</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Revenue Analytics
          </h3>
          <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Chart Placeholder - Revenue Over Time</p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{adminData.systemStats.serverUptime}%</div>
            <div className="text-gray-400 text-sm">Server Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{adminData.systemStats.apiResponseTime}ms</div>
            <div className="text-gray-400 text-sm">API Response</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{formatNumber(adminData.systemStats.activeConnections)}</div>
            <div className="text-gray-400 text-sm">Active Connections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{adminData.systemStats.errorRate}%</div>
            <div className="text-gray-400 text-sm">Error Rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Users Tab
  const renderUsers = () => (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button icon={<Plus className="w-4 h-4" />}>
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">User</th>
                <th className="text-left p-4 text-gray-300 font-medium">Level</th>
                <th className="text-left p-4 text-gray-300 font-medium">Balance</th>
                <th className="text-left p-4 text-gray-300 font-medium">KYC Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Joined</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((userData, index) => (
                <tr key={userData.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={userData.avatar}
                        alt={userData.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-white">{userData.fullName}</div>
                        <div className="text-gray-400 text-sm">@{userData.username}</div>
                        <div className="text-gray-500 text-xs">{userData.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">Level {userData.statistics.level}</div>
                    <div className="text-gray-400 text-sm">{formatNumber(userData.statistics.experience)} XP</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-medium">{formatNumber(userData.coins.available)} BC</div>
                    <div className="text-gray-400 text-sm">Total: {formatNumber(userData.coins.total)} BC</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      userData.kyc.status === 'verified' ? 'bg-green-600 text-green-100' :
                      userData.kyc.status === 'pending' ? 'bg-yellow-600 text-yellow-100' :
                      'bg-gray-600 text-gray-100'
                    }`}>
                      {userData.kyc.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {formatRelativeTime(userData.joinedDate)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewUser(userData)}
                        className="text-blue-400 hover:text-blue-300 p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleBanUser(userData.id)}
                        className="text-yellow-400 hover:text-yellow-300 p-1"
                        title="Ban User"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(userData.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Music Tab
  const renderMusic = () => (
    <div className="space-y-6">
      {/* Music Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Total Plays</h3>
          <div className="text-3xl font-bold text-blue-400">{formatNumber(adminData.musicStats.totalPlays)}</div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Popular Genres</h3>
          <div className="space-y-2">
            {adminData.musicStats.popularGenres.slice(0, 3).map(genre => (
              <div key={genre.genre} className="flex justify-between">
                <span className="text-gray-300">{genre.genre}</span>
                <span className="text-blue-400">{genre.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Songs</h3>
          <div className="space-y-2">
            {adminData.musicStats.topSongs.map((song, index) => (
              <div key={song.id} className="flex justify-between">
                <span className="text-gray-300 truncate">#{index + 1} {song.title}</span>
                <span className="text-green-400">{formatNumber(song.plays)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Genre Distribution Chart */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <PieChart className="w-5 h-5 mr-2" />
          Genre Distribution
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Pie Chart Placeholder - Genre Distribution</p>
          </div>
          <div className="space-y-3">
            {adminData.musicStats.popularGenres.map(genre => (
              <div key={genre.genre} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-white">{genre.genre}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{formatNumber(genre.plays)}</div>
                  <div className="text-gray-400 text-sm">{genre.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Transactions Tab
  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">ID</th>
                <th className="text-left p-4 text-gray-300 font-medium">User</th>
                <th className="text-left p-4 text-gray-300 font-medium">Type</th>
                <th className="text-left p-4 text-gray-300 font-medium">Amount</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Time</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminData.recentTransactions.map(transaction => (
                <tr key={transaction.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                  <td className="p-4 text-gray-300 font-mono text-sm">{transaction.id}</td>
                  <td className="p-4 text-white">@{transaction.username}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'withdrawal' ? 'bg-red-600 text-red-100' :
                      'bg-green-600 text-green-100'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="p-4 text-white font-medium">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center space-x-1 ${
                      transaction.status === 'completed' ? 'text-green-400' :
                      transaction.status === 'pending' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {transaction.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                       transaction.status === 'pending' ? <Clock className="w-4 h-4" /> :
                       <XCircle className="w-4 h-4" />}
                      <span className="capitalize">{transaction.status}</span>
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">
                    {formatRelativeTime(transaction.timestamp)}
                  </td>
                  <td className="p-4">
                    <button className="text-blue-400 hover:text-blue-300 p-1">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: t('admin.overview'), icon: BarChart3 },
    { id: 'users', label: t('admin.users'), icon: Users },
    { id: 'music', label: t('admin.songs'), icon: Music },
    { id: 'transactions', label: t('admin.transactions'), icon: DollarSign },
    { id: 'settings', label: t('admin.systemSettings'), icon: Settings }
  ];

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{t('admin.adminPanel')}</h1>
              <p className="text-gray-400 mt-1">Manage your BigCoin Piano platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white font-medium">{user.fullName}</div>
                <div className="text-gray-400 text-sm">Administrator</div>
              </div>
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'music' && renderMusic()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Settings</h3>
            <p className="text-gray-400">Settings panel coming soon...</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.username}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedUser.fullName}</h3>
                <p className="text-gray-400">@{selectedUser.username}</p>
                <p className="text-gray-500 text-sm">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-white mb-2">Account Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level:</span>
                    <span className="text-white">{selectedUser.statistics.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Experience:</span>
                    <span className="text-white">{formatNumber(selectedUser.statistics.experience)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Games:</span>
                    <span className="text-white">{selectedUser.statistics.totalGames}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Score:</span>
                    <span className="text-white">{formatNumber(selectedUser.statistics.bestScore)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2">Balance Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Available:</span>
                    <span className="text-white">{formatNumber(selectedUser.coins.available)} BC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pending:</span>
                    <span className="text-white">{formatNumber(selectedUser.coins.pending)} BC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Earned:</span>
                    <span className="text-white">{formatNumber(selectedUser.coins.earned)} BC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Withdrawn:</span>
                    <span className="text-white">{formatNumber(selectedUser.coins.withdrawn)} BC</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-2">KYC Status</h4>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedUser.kyc.status === 'verified' ? 'bg-green-600 text-green-100' :
                  selectedUser.kyc.status === 'pending' ? 'bg-yellow-600 text-yellow-100' :
                  'bg-gray-600 text-gray-100'
                }`}>
                  {selectedUser.kyc.status.charAt(0).toUpperCase() + selectedUser.kyc.status.slice(1)}
                </span>
                {selectedUser.kyc.status === 'pending' && (
                  <div className="space-x-2">
                    <Button size="sm" variant="success">Approve</Button>
                    <Button size="sm" variant="danger">Reject</Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button variant="outline" onClick={() => setShowUserModal(false)} className="flex-1">
                Close
              </Button>
              <Button variant="warning" className="flex-1">
                Ban User
              </Button>
              <Button className="flex-1">
                Edit User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPanelPage;