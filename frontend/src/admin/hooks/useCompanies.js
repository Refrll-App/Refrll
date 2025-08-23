import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';

export const useCompanies = () =>
  useQuery({
    queryKey: ['admin-companies'],
    queryFn: () => axiosInstance.get('/api/admin/companies').then(r => r.data),
  });