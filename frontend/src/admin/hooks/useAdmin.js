import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance'

const handleApiError = (error) => {
  const message = error.response?.data?.error || error.message || 'Something went wrong';
  toast.error(message);
  throw error;
};

// User Management Hooks
export const useAdminUsers = ({ page = 1, limit = 10, search = '', role = 'all' }) => {
  return useQuery({
    queryKey: ['adminUsers', page, limit, search, role],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/admin/users', {
        params: { page, limit, search, role }
      });
      return response.data;
    },
    onError: handleApiError,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes('401') || error.message.includes('403')) return false;
      return failureCount < 3;
    }
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      const response = await axiosInstance.post('/api/admin/users', userData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries(['adminUsers']);
    },
    onError: handleApiError
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...userData }) => {
      const response = await axiosInstance.patch(`/api/admin/users/${id}`, userData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries(['adminUsers']);
    },
    onError: handleApiError
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/api/admin/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries(['adminUsers']);
    },
    onError: handleApiError
  });
};

// Job Management Hooks
export const useAdminJobs = ({ page = 1, limit = 10, search = '', status = 'all' }) => {
  return useQuery({
    queryKey: ['adminJobs', page, limit, search, status],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/admin/jobs', {
        params: { page, limit, search, status }
      });
      return response.data;
    },
    onError: handleApiError,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes('401') || error.message.includes('403')) return false;
      return failureCount < 3;
    }
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobData) => {
      const response = await axiosInstance.post('/api/admin/jobs', jobData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Job created successfully');
      queryClient.invalidateQueries(['adminJobs']);
    },
    onError: handleApiError
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...jobData }) => {
      const response = await axiosInstance.patch(`/api/admin/jobs/${id}`, jobData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Job updated successfully');
      queryClient.invalidateQueries(['adminJobs']);
    },
    onError: handleApiError
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/api/admin/jobs/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Job deleted successfully');
      queryClient.invalidateQueries(['adminJobs']);
    },
    onError: handleApiError
  });
};

// Application Management Hooks
export const useAdminApplications = ({ page = 1, limit = 10, search = '', status = 'all' }) => {
  return useQuery({
    queryKey: ['adminApplications', page, limit, search, status],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/admin/applications', {
        params: { page, limit, search, status }
      });
      return response.data;
    },
    onError: handleApiError,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes('401') || error.message.includes('403')) return false;
      return failureCount < 3;
    }
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axiosInstance.patch(`/api/admin/applications/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Application updated successfully');
      queryClient.invalidateQueries(['adminApplications']);
    },
    onError: handleApiError
  });
};

// Analytics Hooks
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/admin/stats');
      return response.data;
    },
    onError: handleApiError,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes('401') || error.message.includes('403')) return false;
      return failureCount < 3;
    }
  });
};

export const useAdminTrends = ({ range = 'month' }) => {
  return useQuery({
    queryKey: ['adminTrends', range],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/admin/stats/trends', {
        params: { range }
      });
      return response.data;
    },
    onError: handleApiError,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes('401') || error.message.includes('403')) return false;
      return failureCount < 3;
    }
  });
};

// System Settings Hook
export const useAdminRoles = () => {
  return useQuery({
    queryKey: ['adminRoles'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/admin/roles');
      return response.data;
    },
    onError: handleApiError,
    staleTime: Infinity,
    retry: (failureCount, error) => {
      if (error.message.includes('401') || error.message.includes('403')) return false;
      return failureCount < 3;
    }
  });
};