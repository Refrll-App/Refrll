// src/admin/hooks/useJobs.js


import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';

export const useJobs = () =>
  useQuery({
    queryKey: ['admin-jobs'],
    queryFn: () => axiosInstance.get('/api/admin/jobs').then(r => r.data),
  });
