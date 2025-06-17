import api from './index';

export const musicService = {
    getMusicStats: async () => ({
      stats: {
        totalSongs: 1234,
        totalArtists: 456,
        totalGenres: 12,
        totalPlays: 98765
      }
    }),
    
    searchMusic: async (params) => {
      // Simulating a search operation
      console.log(`Searching music with params:`, params);
      const response = await api.get(`/music/search?page=${params.page}&q=${params.q}`, params);
      return response.data;
      // return response.filter(song => song.title.toLowerCase().includes(params.query.toLowerCase()));
    },

    getMusicById: async (id) => {
      // Simulating fetching music by ID
      console.log(`Fetching music with ID: ${id}`);
      const response = await api.get(`/music/${id}`);
      return response.data;
    },
    
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