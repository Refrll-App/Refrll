import { useQuery } from '@tanstack/react-query';

import axiosInstance from '../../api/axiosInstance';

export const useApplications = () =>
  useQuery({
    queryKey: ['admin-applications'],
    queryFn: () => axiosInstance.get('/api/admin/applications').then(r => r.data),
  });