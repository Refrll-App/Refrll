// src/hooks/useReferral.js
import {  useQuery,  } from '@tanstack/react-query';

import axiosInstance from '../api/axiosInstance';

export const useTopReferrers = () => {
  return useQuery({
    queryKey: ['topReferrers'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/referrals/leaderboard');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};
