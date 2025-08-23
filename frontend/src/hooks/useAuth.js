import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryClient } from '../App';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance, { markLoggingOut } from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
    const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  return useMutation({
    mutationFn: ({ email, password }) =>
      axiosInstance
        .post('/api/auth/login', { email, password }, { withCredentials: true }) 
        .then((r) => r.data.user),
        

    onSuccess: async (user) => {
      // ✅ Invalidate cached user profile so Navbar re-fetches
      setUser(user); // Update Zustand auth state with user data
      setLoggedIn(true); // Set logged-in state to true
      await queryClient.invalidateQueries({ queryKey: ['me'],user });
          


      if (user.currentRole === 'seeker') {
        navigate('/employee/dashboard');
      } else if (user.currentRole === 'referrer') {
        navigate('/employee/referrer');
      } else if (user.currentRole === 'hr') {
        navigate('/hr/dashboard');
      }else if (user.currentRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }


    },
  });
};


export const useRegister = () =>
  useMutation({
    mutationFn: ({ name, email, password }) =>
      axiosInstance.post('/api/auth/register', { name, email, password }).then((r) => r.data.user),
  });


export const useRegisterHr = () =>
  useMutation({
    mutationFn: ({ name, email, password, companyName }) =>
      axiosInstance.post('/api/auth/register-hr', { name, email, password, companyName }).then((r) => r.data.user),
  });





export const useProfile = ({ force = false } = {}) => {
  const {isLoggedIn,setUser} = useAuthStore((state) => state.isLoggedIn);
  const location = useLocation();
  const isPublicPage = ['/login', '/register', '/', '/about', '/forgot-password', '/reset-password']
    .includes(location.pathname);

  return useQuery({
    queryKey: ['me'], // stays stable
    queryFn: () => axiosInstance.get('/api/users/me').then((res) => res.data),
    
    staleTime: 5 * 60 * 1000, // cache for 5 mins
    cacheTime: 10 * 60 * 1000, // keep in memory for 10 mins
    retry: false,
    refetchOnWindowFocus: false, // prevent auto refetch
    // enabled: force || !isPublicPage, // don’t run on public pages unless forced
      enabled: isLoggedIn, 

  });
};





export const useAvatarUploadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
 mutationFn: async (formData) => {

  return await axiosInstance.post('api/users/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
},

    onSuccess: () => {
      toast.success('Profile picture updated!');
      queryClient.invalidateQueries(['me']);
    },
    onError: () => {
      toast.error('Upload failed');
    },
  });
};




export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      markLoggingOut(); // mark logout *when mutation starts*
      return axiosInstance.post('/api/auth/logout');
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['me'] });
      queryClient.clear();
      navigate('/login');
    },
  });
};


export const useToggleRole = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => axiosInstance.patch('/api/users/toggle-role').then(r => r.data),
    onSuccess: (data) => {
      // Invalidate the profile query to ensure it refetches the latest data
      queryClient.invalidateQueries(['profile']);
      return data; // Return the updated user data
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
  };
};



export const useUpdateProfile = () =>
  useMutation({
    mutationFn: (updates) => axiosInstance.put('/api/users/me', updates).then(r => r.data),
    onSuccess: () => {
      // 🔄 Refetch the profile after update
      queryClient.invalidateQueries(["profile"]);
    },
  });




