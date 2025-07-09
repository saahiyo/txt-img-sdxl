import React from 'react';
import { CloseIcon } from './Icons';

const InfoModal = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} tabIndex={-1} aria-label="Close info overlay" />
      <div className="relative flex flex-col items-center w-full max-w-2xl mx-4 p-0">
        <div className="w-full bg-white/95 dark:bg-[var(--md3-surface)] rounded-2xl shadow-2xl px-10 py-10 border-0 flex flex-col animate-scale-fade-in relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md3-btn-icon bg-black/10 hover:bg-black/20"
            title="Close"
            aria-label="Close info modal"
          >
            <CloseIcon />
          </button>
          <div className="font-extrabold text-3xl mb-2 tracking-tight text-center" style={{letterSpacing: '-0.01em'}}>AI Image Generator</div>
          <div className="text-base mb-4 font-medium text-gray-700 dark:text-[var(--md3-secondary)] text-center">by <a href="https://github.com/saahiyo" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">saahiyo</a></div>
          <div className="text-sm mb-6 text-gray-700 dark:text-[var(--md3-secondary)] text-center">
            <b>Modern React app for generating images with Stable Diffusion XL (SDXL 3.5 Ultra).</b><br/>
            Enter a prompt, select style and aspect ratio, and generate stunning AI art in seconds.<br/>
            <span className="text-xs text-gray-500">No login required. Open source.</span>
          </div>
          <div className="text-xs break-all mb-2 text-gray-500 dark:text-[var(--md3-secondary)] text-center">Project Repo:<br/>
            <a href="https://github.com/saahiyo/txt-img-sdxl" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">github.com/saahiyo/txt-img-sdxl</a>
          </div>
          <div className="mt-2 text-xs text-blue-500 dark:text-[var(--md3-secondary)] text-center">
            Powered by <a href="https://aiart-zroo.onrender.com/api-docs" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">aiart-zroo.onrender.com</a>
          </div>
          <div className="mt-2 text-xs text-gray-400 dark:text-[var(--md3-secondary)] text-center">Stable Diffusion XL via Vercel serverless proxy.<br/>Made with <span className="text-pink-500">♥</span>.</div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal; 