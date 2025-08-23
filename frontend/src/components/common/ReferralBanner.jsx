

import { useEffect, useState, useRef } from "react";

export default function ReferralBanner() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const textWidth = textRef.current.scrollWidth;
    setMaxOffset(textWidth / 2);
    setOffset(0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev >= maxOffset ? 0 : prev + 0.4));
    }, 16); // 60fps
    return () => clearInterval(interval);
  }, [maxOffset]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-800 to-purple-800 dark:from-indigo-900 dark:to-purple-900 py-0.5 shadow-md rounded-md border border-indigo-600/30 dark:border-indigo-800/30">
      <div 
        ref={containerRef}
        className="overflow-hidden"
      >
        <div
          ref={textRef}
          className="whitespace-nowrap inline-block font-medium text-indigo-100 dark:text-indigo-200 text-sm tracking-wide"
          style={{
            transform: `translateX(${-offset}px)`,
            willChange: "transform",
          }}
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className="inline-flex items-center mx-5">
              <span className="flex items-center">
                Post <span className="font-bold text-white mx-1 px-1.5 py-0.5 bg-indigo-700/30 dark:bg-indigo-800/40 rounded-md">jobs</span>
                <SparkleIcon className="text-yellow-300 w-3 h-3 ml-0.5" />
              </span>
              <span className="mx-1.5">•</span>
              <span className="flex items-center">
                <span className="font-bold text-white mx-1 px-1.5 py-0.5 bg-indigo-700/30 dark:bg-indigo-800/40 rounded-md">refer</span> candidates
                <SparkleIcon className="text-yellow-300 w-3 h-3 ml-0.5" />
              </span>
              <span className="mx-1.5">•</span>
              <span className="flex items-center">
                and <span className="font-bold text-white mx-1 px-1.5 py-0.5 bg-indigo-700/30 dark:bg-indigo-800/40 rounded-md">earn rewards</span>
                <SparkleIcon className="text-yellow-300 w-3 h-3 ml-0.5" />
              </span>
            </span>
          ))}
        </div>
      </div>
      
      {/* Gradient fade effect */}
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-indigo-800 dark:from-indigo-900 to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-indigo-800 dark:from-indigo-900 to-transparent z-10"></div>
    </div>
  );
}

const SparkleIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path 
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" 
    />
  </svg>
);