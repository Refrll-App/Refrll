import React from "react";

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm z-50">
      {/* Dual-ring spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-indigo-500 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        {/* Inner ring */}
        <div className="absolute w-12 h-12 border-4 border-indigo-300 dark:border-indigo-600 border-b-transparent rounded-full animate-spin animate-reverse"></div>
      </div>

      {/* Pulsing text */}
      <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200 animate-pulse">
        {text}
      </p>
    </div>
  );
};

export default LoadingSpinner;
