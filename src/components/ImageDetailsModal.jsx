import React from 'react';
import { CloseIcon } from './Icons';

const ImageDetailsModal = ({ show, onClose, imageData }) => {
  if (!show || !imageData) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} tabIndex={-1} aria-label="Close image details" />
      <div className="relative flex flex-col items-center w-full max-w-md mx-4 p-0">
        <div className="w-full bg-white/95 dark:bg-[var(--md3-surface)] rounded-2xl shadow-2xl px-6 py-6 border-0 flex flex-col animate-scale-fade-in relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md3-btn-icon bg-black/10 hover:bg-black/20"
            title="Close"
            aria-label="Close image details modal"
          >
            <CloseIcon />
          </button>
          
          <div className="font-bold text-xl mb-4 tracking-tight text-center">Image Details</div>
          
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <div className="md3-chip">
                <span className="text-xs font-medium">Style: {imageData.stylePreset?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}</span>
              </div>
              <div className="md3-chip">
                <span className="text-xs font-medium">Ratio: {imageData.aspectRatio || 'N/A'}</span>
              </div>
              <div className="md3-chip">
                <span className="text-xs font-medium">Size: {imageData.imageSize || 'N/A'}</span>
              </div>
              <div className="md3-chip">
                <span className="text-xs font-medium">SD 3.5 Ultra</span>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 dark:text-[var(--md3-secondary)]">Prompt:</label>
              <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                {imageData.prompt || 'N/A'}
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 dark:text-[var(--md3-secondary)]">Negative Prompt:</label>
              <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                {imageData.negativePrompt || 'N/A'}
              </div>
            </div>
            
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 dark:text-[var(--md3-secondary)]">Generated:</label>
              <div className="mt-1 text-sm text-gray-600 dark:text-[var(--md3-secondary)]">
               {imageData.timestamp}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetailsModal; 