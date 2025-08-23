import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      user: null,
      setUser: (user) => set({ user }),
      clearAuth: () => set({ isLoggedIn: false, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
