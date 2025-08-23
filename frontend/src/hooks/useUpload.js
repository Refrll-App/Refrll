import { useMutation } from '@tanstack/react-query';

import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';



const cloudinaryAxios = axiosInstance.create({ withCredentials: false });



export const useUploadResume = (options = {}) => {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await axiosInstance.post('/api/upload/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
      });

      return res.data.url;
    },
    ...options,
  });

  return {
    ...mutation,
    progress,
  };
};
