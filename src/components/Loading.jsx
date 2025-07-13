import React, { useState, useEffect } from 'react';

const Loading = ({ 
  message = "Generating your masterpiece...", 
  size = "large",
  showSpinner = true,
  showProgress = true,
  progress: externalProgress = null,
  className = ""
}) => {
  const [progress, setProgress] = useState(0);

  // Use external progress if provided, otherwise use internal progress
  const currentProgress = externalProgress !== null ? externalProgress : progress;

  useEffect(() => {
    if (showProgress && externalProgress === null) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            return prev; // Stop at 95% until actual completion
          }
          return prev + Math.random() * 15; // Random increment between 0-15
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [showProgress, externalProgress]);

  // Reset progress when component mounts
  useEffect(() => {
    setProgress(0);
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'medium':
        return 'w-12 h-12';
      case 'large':
        return 'w-12 h-12 sm:w-16 sm:h-16'; // responsive spinner
      case 'xl':
        return 'w-16 h-16 sm:w-20 sm:h-20';
      default:
        return 'w-12 h-12 sm:w-16 sm:h-16';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'medium':
        return 'text-sm';
      case 'large':
        return 'text-base sm:text-lg';
      case 'xl':
        return 'text-lg sm:text-xl';
      default:
        return 'text-base sm:text-lg';
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[220px] min-w-0 h-full w-full md3-surface p-4 sm:p-6 md:p-8 gap-y-6 ${className}`}
      aria-live="polite"
    >
      {showSpinner && (
        <div className={`${getSizeClasses()} border-4 border-dashed rounded-full animate-spin border-[var(--md3-primary)]`} />
      )}
      {message && (
        <p className={`text-[var(--md3-secondary)] ${getTextSize()} text-center font-medium break-words max-w-xs sm:max-w-md`}>{message}</p>
      )}
      {showProgress && (
        <div className="w-full min-w-0 max-w-xs sm:max-w-md flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center mb-1 px-1 min-w-0">
            <span className="text-xs sm:text-sm text-[var(--md3-secondary)] font-medium">Progress</span>
            <span className="text-xs sm:text-sm text-[var(--md3-secondary)] font-semibold">{Math.round(currentProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
            <div 
              className="bg-[var(--md3-primary)] h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loading; 