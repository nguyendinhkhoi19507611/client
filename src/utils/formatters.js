// client/src/utils/formatters.js - Formatting utility functions

// Format numbers with commas
export const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat().format(num);
  };
  
  // Format currency
  export const formatCurrency = (amount, currency = 'USD') => {
    const formatters = {
      USD: (amount) => `$${amount.toFixed(2)}`,
      VND: (amount) => `${amount.toLocaleString('vi-VN')} ₫`,
      SGD: (amount) => `S$${amount.toFixed(2)}`,
      BIGCOIN: (amount) => `${amount.toFixed(4)} BC`
    };
    
    return formatters[currency] ? formatters[currency](amount) : `${amount} ${currency}`;
  };
  
  // Format time duration
  export const formatTime = (seconds) => {
    if (!seconds || seconds < 0) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Format relative time (e.g., "2 hours ago")
  export const formatRelativeTime = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };
  
  // Format percentage
  export const formatPercentage = (value, decimals = 1) => {
    return `${Number(value).toFixed(decimals)}%`;
  };
  
  // Format file size
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };