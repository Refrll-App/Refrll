import axios from 'axios';
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true;

export const authAPI = {
  login: (body) => axios.post('/api/auth/login', body).then(r => r.data),
  register: (body) => axios.post('/api/auth/register', body).then(r => r.data),
  registerHr: (body) => axios.post('/api/auth/register-hr', body).then(r => r.data),
  profile: () => axios.get('/api/users/me').then(r => r.data),
  updateProfile: (body) => axios.put('/api/users/me', body).then(r => r.data)
};

export const jobsAPI = {
  list: (params) => axios.get('/api/jobs', { params }).then(r => r.data),
  detail: (id) => axios.get(`/api/jobs/${id}`).then(r => r.data),
  apply: (jobId) => axios.post('/api/applications', { jobId }).then(r => r.data)
};