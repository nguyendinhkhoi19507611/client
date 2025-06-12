// src/pages/Payment/PaymentPage.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Coins,
  Building,
  Smartphone,
  Bitcoin,
  Eye,
  Download,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import { formatNumber, formatCurrency } from '../../utils/formatters';
import { toast } from 'react-hot-toast';

const PaymentPage = () => {
  const { user, getBalanceInfo } = useAuth();
  const { t, formatRelativeTime } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const balance = getBalanceInfo();

  // Mock transaction data
  const mockTransactions = useMemo(() => [
    {
      id: 'tx_001',
      type: 'earning',
      amount: 25.50,
      currency: 'BIGCOIN',
      status: 'processing',
      description: 'Bank transfer withdrawal',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      fee: 2.5,
      method: 'bank_transfer'
    },
    {
      id: 'tx_003',
      type: 'earning',
      amount: 15.75,
      currency: 'BIGCOIN',
      status: 'completed',
      description: 'Game reward - Canon in D',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      fee: 0
    },
    {
      id: 'tx_004',
      type: 'bonus',
      amount: 50,
      currency: 'BIGCOIN',
      status: 'completed',
      description: 'Referral bonus',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      fee: 0
    },
    {
      id: 'tx_005',
      type: 'withdrawal',
      amount: 250,
      currency: 'USD',
      status: 'completed',
      description: 'Digital wallet withdrawal',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      fee: 5.0,
      method: 'digital_wallet'
    },
    {
      id: 'tx_006',
      type: 'earning',
      amount: 35.25,
      currency: 'BIGCOIN',
      status: 'completed',
      description: 'Game reward - Moonlight Sonata',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      fee: 0
    }
  ], []);

  // Withdrawal methods
  const withdrawalMethods = [
    {
      id: 'bank',
      name: t('payments.bankTransfer'),
      icon: Building,
      fee: '2.5%',
      minAmount: 50,
      processingTime: '1-3 business days',
      description: 'Direct transfer to your bank account'
    },
    {
      id: 'digital_wallet',
      name: t('payments.digitalWallet'),
      icon: Smartphone,
      fee: '1.5%',
      minAmount: 20,
      processingTime: '24 hours',
      description: 'PayPal, Skrill, or other digital wallets'
    },
    {
      id: 'crypto',
      name: t('payments.cryptocurrency'),
      icon: Bitcoin,
      fee: '1.0%',
      minAmount: 10,
      processingTime: '30 minutes',
      description: 'Bitcoin, Ethereum, or other cryptocurrencies'
    }
  ];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tx.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || tx.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [mockTransactions, searchQuery, filterStatus]);

  // Handle withdrawal
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    const selectedMethodData = withdrawalMethods.find(m => m.id === selectedMethod);
    
    if (!amount || amount < selectedMethodData.minAmount) {
      toast.error(`Minimum withdrawal amount is ${selectedMethodData.minAmount}`);
      return;
    }

    if (amount > balance.available * 0.01) { // Assuming 1 BC = $0.01
      toast.error(t('errors.insufficientBalance'));
      return;
    }

    // Mock withdrawal process
    toast.success('Withdrawal request submitted successfully!');
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  // Render Overview Tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">{t('wallet.availableBalance')}</p>
              <p className="text-3xl font-bold">{formatNumber(balance.available)} BC</p>
              <p className="text-green-200 text-sm">≈ {formatCurrency(balance.available * 0.01)}</p>
            </div>
            <Coins className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">{t('wallet.pendingBalance')}</p>
              <p className="text-3xl font-bold">{formatNumber(balance.pending)} BC</p>
              <p className="text-yellow-200 text-sm">≈ {formatCurrency(balance.pending * 0.01)}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">{t('wallet.totalEarned')}</p>
              <p className="text-3xl font-bold">{formatNumber(balance.earned)} BC</p>
              <p className="text-blue-200 text-sm">≈ {formatCurrency(balance.earned * 0.01)}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <ArrowUpRight className="w-5 h-5 mr-2" />
            {t('wallet.withdraw')}
          </h3>
          <p className="text-gray-400 mb-4">Convert your BigCoins to real money</p>
          <Button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600"
            disabled={balance.available < 50}
          >
            {t('wallet.withdraw')} BigCoins
          </Button>
          {balance.available < 50 && (
            <p className="text-yellow-400 text-sm mt-2">Minimum 50 BC required</p>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <ArrowDownLeft className="w-5 h-5 mr-2" />
            Earning Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">This Week:</span>
              <span className="text-green-400">+125.50 BC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">This Month:</span>
              <span className="text-green-400">+456.75 BC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">All Time:</span>
              <span className="text-green-400">+{formatNumber(balance.earned)} BC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Withdrawal Methods */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{t('payments.withdrawalMethods')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {withdrawalMethods.map(method => (
            <div key={method.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <method.icon className="w-8 h-8 text-blue-400" />
                <div>
                  <h4 className="font-medium text-white">{method.name}</h4>
                  <p className="text-gray-400 text-sm">Fee: {method.fee}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-2">{method.description}</p>
              <div className="text-xs text-gray-400">
                <div>Min: ${method.minAmount}</div>
                <div>Time: {method.processingTime}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render History Tab
  const renderHistory = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">ID</th>
                <th className="text-left p-4 text-gray-300 font-medium">Type</th>
                <th className="text-left p-4 text-gray-300 font-medium">Amount</th>
                <th className="text-left p-4 text-gray-300 font-medium">Fee</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Description</th>
                <th className="text-left p-4 text-gray-300 font-medium">Time</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                  <td className="p-4 text-gray-300 font-mono text-sm">{transaction.id}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {transaction.type === 'withdrawal' ? (
                        <ArrowUpRight className="w-4 h-4 text-red-400" />
                      ) : transaction.type === 'deposit' ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-400" />
                      ) : (
                        <Coins className="w-4 h-4 text-yellow-400" />
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'withdrawal' ? 'bg-red-600/20 text-red-400' :
                        transaction.type === 'deposit' ? 'bg-green-600/20 text-green-400' :
                        'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`font-medium ${
                      transaction.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {transaction.type === 'withdrawal' ? '-' : '+'}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">
                    {transaction.fee > 0 ? formatCurrency(transaction.fee) : '-'}
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center space-x-1 ${
                      transaction.status === 'completed' ? 'text-green-400' :
                      transaction.status === 'processing' ? 'text-blue-400' :
                      transaction.status === 'pending' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {transaction.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                       transaction.status === 'processing' ? <Clock className="w-4 h-4" /> :
                       transaction.status === 'pending' ? <AlertCircle className="w-4 h-4" /> :
                       <XCircle className="w-4 h-4" />}
                      <span className="capitalize">{transaction.status}</span>
                    </span>
                  </td>
                  <td className="p-4 text-white max-w-xs truncate">{transaction.description}</td>
                  <td className="p-4 text-gray-400">
                    {formatRelativeTime(transaction.timestamp)}
                  </td>
                  <td className="p-4">
                    <button className="text-blue-400 hover:text-blue-300 p-1" title="View Details">
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
    { id: 'overview', label: t('admin.overview'), icon: Wallet },
    { id: 'history', label: t('wallet.history'), icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <Wallet className="w-8 h-8 mr-3" />
                {t('wallet.balance')} & {t('payments.paymentHistory')}
              </h1>
              <p className="text-gray-400 mt-1">Manage your BigCoin wallet and transactions</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                {formatNumber(balance.available)} BC
              </div>
              <div className="text-gray-400 text-sm">
                ≈ {formatCurrency(balance.available * 0.01)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
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
        {activeTab === 'history' && renderHistory()}
      </div>

      {/* Withdrawal Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title={t('wallet.withdrawalRequest')}
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <p className="text-yellow-200 text-sm">
                KYC verification required for withdrawals. Current status: 
                <span className={`ml-1 font-medium ${
                  user?.kyc?.status === 'verified' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {user?.kyc?.status || 'Not submitted'}
                </span>
              </p>
            </div>
          </div>

          {/* Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              {t('wallet.paymentMethod')}
            </label>
            <div className="grid grid-cols-1 gap-3">
              {withdrawalMethods.map(method => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-600/20'
                      : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <method.icon className="w-6 h-6 text-blue-400" />
                      <div>
                        <h4 className="font-medium text-white">{method.name}</h4>
                        <p className="text-gray-400 text-sm">{method.description}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-white">Fee: {method.fee}</div>
                      <div className="text-gray-400">Min: ${method.minAmount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Withdrawal Amount (USD)
            </label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              min={withdrawalMethods.find(m => m.id === selectedMethod)?.minAmount || 10}
              max={balance.available * 0.01}
            />
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-400">
                Available: {formatNumber(balance.available)} BC (≈{formatCurrency(balance.available * 0.01)})
              </span>
              <span className="text-gray-400">
                Fee: {withdrawalMethods.find(m => m.id === selectedMethod)?.fee || '1%'}
              </span>
            </div>
          </div>

          {/* Summary */}
          {withdrawAmount && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">Withdrawal Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">{formatCurrency(parseFloat(withdrawAmount) || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee:</span>
                  <span className="text-white">
                    {formatCurrency((parseFloat(withdrawAmount) || 0) * 0.025)}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-300">You'll receive:</span>
                  <span className="text-green-400">
                    {formatCurrency((parseFloat(withdrawAmount) || 0) * 0.975)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowWithdrawModal(false)} 
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleWithdraw}
              className="flex-1 bg-gradient-to-r from-red-600 to-pink-600"
              disabled={!withdrawAmount || parseFloat(withdrawAmount) < (withdrawalMethods.find(m => m.id === selectedMethod)?.minAmount || 10)}
            >
              {t('wallet.withdraw')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentPage;