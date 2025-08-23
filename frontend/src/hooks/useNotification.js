


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';

import { useProfile } from './useAuth';
import axiosInstance from '../api/axiosInstance';


export const fetchNotifications = async () => {
  const { data } = await axiosInstance.get('/api/notifications');

  return data || [];
};



export const useNotifications = () => {
  const { data: user, isLoading } = useProfile();

  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    enabled: !!user && !isLoading,  // ✅ only fetch when user is loaded and logged in
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    retry: false,
  });
};



export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axiosInstance.put(`/api/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
    onError: () => toast.error('Failed to mark as read'),
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => axiosInstance.put('/api/notifications/mark-all-read'),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
    onError: () => toast.error('Failed to mark all as read'),
  });
};




