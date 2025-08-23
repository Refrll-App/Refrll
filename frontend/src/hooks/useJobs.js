import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';


export const useJobs = (filters = {}, page = 1, limit = 12) =>
  useQuery({
    queryKey: ['jobs', filters, page],
    queryFn: () =>
      axiosInstance.get('/api/jobs', { params: { ...filters, page, limit } }).then(r => r.data),
    staleTime: 60 * 1000
  });

export const useApplyJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId) => axiosInstance.post('/api/applications', { jobId }).then(res => res.data),

    onSuccess: (_, jobId) => {
      // Invalidate job query so refetch fetches latest applications
      queryClient.invalidateQueries(['job', jobId]);
    },
  });
};


export const useMyApplications = () =>
  useQuery({
    queryKey: ['my-applications'],
    queryFn: () => axiosInstance.get('/api/applications/me').then(r => r.data),
    staleTime: 30 * 1000, // 30 s live feel
  });


 export const useMyReferrals = (page=1, limit=10) =>
  useQuery({
    queryKey: ['my-referrals', page],
    queryFn: () => axiosInstance.get(`/api/jobs/my-referrals?page=${page}&limit=${limit}`).then(r => r.data),
    staleTime: 60 * 1000
  });


export const useCompanyJobsToClaim = ({ search, experience, skills, page, limit }) => 
  useQuery({
    queryKey: ['claimable-jobs', { search, experience, skills, page, limit }],
    queryFn: () => axiosInstance.get('/api/jobs/claimable', {
      params: { search, experience, skills, page, limit }
    }).then(r => r.data),
    keepPreviousData: true, // optional but useful for pagination
  });



export const useClaimJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId) => axiosInstance.post(`/api/jobs/${jobId}/claim`),

    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: ['claimable-jobs'] });

      const previousData = queryClient.getQueryData(['claimable-jobs']);

      if (!previousData || !Array.isArray(previousData.jobs)) return { previousData };

      queryClient.setQueryData(['claimable-jobs'], old => ({
        ...old,
        jobs: old.jobs.map(job =>
          job._id === jobId ? { ...job, claimedByMe: true } : job
        )
      }));

      return { previousData };
    },

    onError: (err, jobId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['claimable-jobs'], context.previousData);
      }
    
    },


    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['claimable-jobs'] });
    },
  });
};


  export const useApplicationsForJob = (jobId) =>
  useQuery({
    queryKey: ['applications', jobId],
    queryFn: () => axiosInstance.get(`/api/applications/job/${jobId}`).then(r => r.data),
  });



export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => axiosInstance.post('/api/jobs/company', body),
    onSuccess: (res) => {
      // Option 1: Refetch HR jobs after posting
      queryClient.invalidateQueries(['hr-jobs']);

      // Option 2 (optional for instant update): prepend to cache
      queryClient.setQueryData(['hr-jobs'], (oldData = []) => [res.data, ...oldData]);
    },
  });
};

export const useDeleteJob = () =>
  useMutation({
    mutationFn: (id) => axiosInstance.delete(`/api/jobs/${id}`),
  });




export const useCompanies = () =>
  useQuery({
    queryKey: ['companies'],
    queryFn: () => axiosInstance.get('/api/companies').then(r => r.data),
    staleTime: 5 * 60 * 1000
  });

export const useCreateReferralJob = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // ✅ You were missing this

  return useMutation({
    mutationFn: (body) =>
      axiosInstance.post('/api/jobs/referral', body).then((res) => res.data),

    onSuccess: async () => {
      toast.success('Job posted successfully');

      // ✅ Wait for query invalidation to complete
      await queryClient.invalidateQueries({ queryKey: ['my-referrals'] });

      // ✅ Then navigate
      navigate('/employee/referrer');
    },

    onError: (err) => {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to post job. Please try again.');
      }
    },
  });
};



  // src/hooks/useJobs.jsexport 
  export const useReferrerApplications = () =>
  useQuery({
    queryKey: ['referrer-applications'],
    queryFn: () =>axiosInstance.get('/api/applications/referrer').then(r => r.data),
     select: (data) => data || [],
    onError: (err) => {
  
      toast.error(err.response?.data?.message || 'Failed to fetch applications');
    }
  });



export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appId, status }) =>
      axiosInstance.patch(`/api/applications/${appId}/status`, { status }),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] });

      const previousData = queryClient.getQueryData(['applications']);

      queryClient.setQueryData(['applications'], (oldData) => {
        if (!oldData) return oldData;

        // If oldData is an object with applications array
        if (oldData.applications) {
          return {
            ...oldData,
            applications: oldData.applications.map((app) =>
              app._id === variables.appId
                ? { ...app, status: variables.status }
                : app
            ),
          };
        }

        // If oldData is directly an array
        return oldData.map((app) =>
          app._id === variables.appId
            ? { ...app, status: variables.status }
            : app
        );
      });

      return { previousData };
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(['applications'], context.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
};



export const useJobById = (id) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => axiosInstance.get(`/api/jobs/${id}`).then(r => r.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


export const useApplicationStatus = (jobId) => {
  return useQuery({
    queryKey: ['applicationStatus', jobId],
   queryFn: async () => {
  try {
    const res = await axiosInstance.get(`/api/applications/status/${jobId}`);
    return res.data || { applied: false };
  } catch (err) {
    console.error('Application status fetch failed', err);
    return { applied: false }; // fallback to false
  }
},
    staleTime: 1 * 60 * 1000,
  });
};


export const useGetJobById = (jobId) =>
  useQuery({
    queryKey: ['job', jobId],
    queryFn: () => axiosInstance.get(`/api/jobs/${jobId}`).then(r => r.data),
  });


export const useUpdateJob = () =>
  useMutation({
    mutationFn: ({ jobId, updatedJob }) => {
     
    

      return axiosInstance.patch(`/api/jobs/${jobId}`, updatedJob);
    },
  });





export const useHrJobs = (query = {}) => {
  return useQuery({
    queryKey: ['hr-jobs', query],
    queryFn: () => axiosInstance.get('/api/jobs/hr', { params: query }).then(res => res.data),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000 // 2 minutes
  });
};

// HR Dashboard Metrics
export const useHrDashboardMetrics = () => {
  return useQuery({
    queryKey: ['hr-dashboard-metrics'],
    queryFn: () => axiosInstance.get('/api/jobs/hr/dashboard/metrics').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
};



// export const useApplicationsForHrJob = (jobId, page = 1, search = '', status = 'all', limit = 10) => {
//   return useQuery({
//     queryKey: ['applications', jobId, page, search, status, limit],
//     queryFn: () => 
//       axiosInstance.get(`/api/jobs/${jobId}/applications`, {
//         params: { page, search, status, limit }
//       }).then(res => res.data),
//     keepPreviousData: true,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     enabled: !!jobId,
//     refetchOnWindowFocus: false
//   });
// };

export const useApplicationsForHrJob = (jobId, filters) => {
  return useQuery({
    queryKey: ['applications', jobId, filters],
    queryFn: () => 
      axiosInstance.get(`/api/jobs/${jobId}/applications`, {
        params: filters
      }).then(res => res.data),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    enabled: !!jobId,
    refetchOnWindowFocus: false
  });
};



const downloadExcel = async (jobId) => {
  const response = await axios.get(`/api/applications/download-excel`, {
    params: { jobId },
    responseType: 'blob', // ensures file is treated as binary
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });

  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'applications.xlsx';
  document.body.appendChild(a); // for Firefox
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};


export const useDownloadExcel = () =>
  useMutation({
    mutationFn: (jobId) => downloadExcel(jobId),
    onError: (err) => {
      console.error(err);
      alert('Download failed!');
    },
  });
