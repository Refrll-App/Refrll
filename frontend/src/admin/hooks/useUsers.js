import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';

export const useUsers = () =>
  useQuery({
    queryKey: ['admin-users'],
    queryFn: () => axiosInstance.get('/api/admin/users').then(r => r.data),
  });