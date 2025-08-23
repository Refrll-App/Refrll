// import { useEffect } from 'react';
// import { useAuthStore } from '../store/authStore';

// export default function useDark() {
//   const dark = useAuthStore((s) => s.dark);
//   useEffect(() => {
//     if (dark) document.documentElement.classList.add('dark');
//     else document.documentElement.classList.remove('dark');
//   }, [dark]);
// }