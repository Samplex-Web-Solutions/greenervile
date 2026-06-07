import React from 'react';

const LoadingSpinner = ({ fullScreen = true }) => {
  const containerClass = fullScreen 
    ? "min-h-screen bg-slate-900 flex flex-col items-center justify-center" 
    : "flex flex-col items-center justify-center p-4";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        {/* The Spinner you liked */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        
        {/* Added a professional status text */}
        <p className="text-emerald-500 font-medium animate-pulse tracking-wide uppercase text-xs">
          Greener Vile Investment .inc
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;