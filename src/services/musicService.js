// src/services/musicService.js - Mock music service
export const musicService = {
    getMusicStats: async () => ({
      stats: {
        totalSongs: 1234,
        totalArtists: 456,
        totalGenres: 12,
        totalPlays: 98765
      }
    }),
    
    searchMusic: async (params) => ({
      music: [],
      total: 0
    }),
    
    getMusicById: async (id) => null,
    
    getFeaturedMusic: async () => {
      return []
    } ,
    
    getTrendingMusic: async () => []
  };
  
  // Mock react-query functionality
  export const useQuery = (key, queryFn, options = {}) => {
    const [data, setData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    
    React.useEffect(() => {
      if (typeof queryFn === 'function') {
        Promise.resolve(queryFn())
          .then(result => {
            setData(result);
            setIsLoading(false);
          })
          .catch(err => {
            setError(err);
            setIsLoading(false);
          });
      }
    }, []);
    
    return { data, isLoading, error };
  };