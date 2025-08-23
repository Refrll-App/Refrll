// // src/admin/index.js
// import React, { lazy, Suspense } from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AdminLayout from './components/layout/AdminLayout';
// import AdminDashboardPage from './AdminDashboardPage';

// const Dashboard = lazy(() => import('./pages/Dashboard'));
// const Jobs = lazy(() => import('./pages/Jobs'));
// const Companies = lazy(() => import('./pages/Companies'));
// const Candidates = lazy(() => import('./pages/Candidates'));
// const Users = lazy(() => import('./pages/Users'));

// // const queryClient = new QueryClient({
// //   defaultOptions: {
// //     queries: {
// //       staleTime: 5 * 60 * 1000,
// //       cacheTime: 30 * 60 * 1000,
// //       retry: 1,
// //     },
// //   },
// // });

// export default function AdminInterface() {
//   return (
  
//         <AdminLayout>
//           <Suspense fallback={<div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//           </div>}>
//             <Routes>
//               <Route path="/admin" element={<AdminDashboardPage />} />
//               {/* <Route path="/jobs" element={<Jobs />} />
//               <Route path="/companies" element={<Companies />} />
//               <Route path="/candidates" element={<Candidates />} />
//               <Route path="/users" element={<Users />} /> */}
//             </Routes>
//           </Suspense>
//         </AdminLayout>
   
//   );
// }