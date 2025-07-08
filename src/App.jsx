import React, { useState, useCallback } from 'react';
import { config } from './config';

// --- Helper Components ---

// Icon for the generate button
const GenerateIcon = () => (
  <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707.707M12 21v-1m0-16a8 8 0 100 16 8 8 0 000-16z"></path>
  </svg>
);

// Copy icon
const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
  </svg>
);

// Download icon
const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
  </svg>
);

// View/Expand icon
const ViewIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
  </svg>
);

// Close icon
const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

// Loading spinner component
const Spinner = () => (
  <div className="flex flex-col items-center justify-center h-full w-full md3-surface p-4">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[var(--md3-primary)]"></div>
    <p className="mt-4 text-[var(--md3-secondary)]">Generating your masterpiece...</p>
  </div>
);

// Error message component
const ErrorDisplay = ({ message }) => (
  <div className="flex items-center justify-center h-full">
    <div className="p-2 text-center md3-surface border border-[var(--md3-primary)]">
      <h3 className="font-bold text-[var(--md3-primary)]">An Error Occurred</h3>
      <p className="text-[var(--md3-secondary)]">{message}</p>
    </div>
  </div>
);

// Placeholder for the image area
const ImagePlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full w-full text-center md3-surface border-2 border-dashed border-[var(--md3-border)] p-2">
    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    <h3 className="font-semibold">Your Image Will Appear Here</h3>
    <p className="text-sm">Enter a prompt and click "Generate" to create an image.</p>
  </div>
);

// Add a BackIcon component
const BackIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
  </svg>
);

// --- Main App Component ---

function App() {
  // State management for form inputs and app status
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState(config.DEFAULT_PARAMS.negative_prompt);
  const [stylePreset, setStylePreset] = useState(config.DEFAULT_PARAMS.style_preset);
  const [aspectRatio, setAspectRatio] = useState(config.DEFAULT_PARAMS.aspect_ratio);
  
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // State to store the actual generation parameters for the current image
  const [generatedImageData, setGeneratedImageData] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showInfoPage, setShowInfoPage] = useState(false);

  // API endpoint from your server.js configuration
  const API_URL = `${config.API_BASE_URL}/api/generate`;

  // List of available style presets for the dropdown
  const stylePresets = [
    "cinematic", "photographic", "anime", "digital-art", "comic-book", 
    "fantasy-art", "analog-film", "neon-punk", "isometric", "low-poly", 
    "origami", "line-art", "modeling-compound", "pixel-art", "tile-texture"
  ];
  

  // List of available aspect ratios
  const aspectRatios = ["16:9", "1:1", "21:9", "2:3", "3:2", "4:5", "5:4", "9:16"];

  // Show toast message
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Copy prompt to clipboard
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      showToastMessage('Prompt copied to clipboard!');
    } catch (err) {
      showToastMessage('Failed to copy prompt');
    }
  };

  // download image function
  const downloadImage = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `generated-image-${Date.now()}.png`; // <-- fixed
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToastMessage('Image downloaded!');
  };
  
  
  

  // Toggle fullscreen view
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  /**
   * Handles the image generation process by calling the backend API.
   * useCallback is used for performance optimization, preventing re-creation on re-renders.
   */
  const handleGenerateImage = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isLoading) return;

    // Reset state for a new request
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedImageData(null);

    // Basic validation
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image.');
      setIsLoading(false);
      return;
    }

    // Payload for the API request, matching server.js expectations
    const payload = {
      video_description: prompt,
      negative_prompt: negativePrompt,
      style_preset: stylePreset,
      aspect_ratio: aspectRatio,
      output_format: config.DEFAULT_PARAMS.output_format,
      seed: config.DEFAULT_PARAMS.seed
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // Use the error message from the API if available
        throw new Error(result.error || `Request failed with status: ${response.status}`);
      }
      
      // The backend returns a URL to the generated image
      if (result.success && (result.direct_url || result.image_url)) {
        // Use direct_url if available, otherwise fall back to image_url
        setGeneratedImage(result.direct_url || result.image_url);
        // Store the generation parameters for this specific image
        setGeneratedImageData({
          prompt: prompt,
          negativePrompt: negativePrompt,
          stylePreset: stylePreset,
          aspectRatio: aspectRatio,
          timestamp: new Date().toISOString()
        });
      } else {
        // Handle cases where the API call was "ok" but didn't succeed logically
        throw new Error(result.message || 'API did not return a valid image URL.');
      }

    } catch (err) {
      console.error('Generation Error:', err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      // Ensure loading state is always turned off
      setIsLoading(false);
    }
  }, [prompt, negativePrompt, stylePreset, aspectRatio, isLoading]);

  // Main component render method
  return (
    <div className="min-h-screen bg-[var(--md3-bg)] text-[var(--md3-text)] font-sans flex flex-col md:flex-row">
      {/* Info Chip (always visible, top right) */}
      <button
        className="fixed top-4 right-4 z-50 md3-chip flex items-center gap-2 bg-[var(--md3-surface)] border border-[var(--md3-primary)] hover:bg-[var(--md3-primary)] hover:text-white transition-colors shadow-md"
        style={{ fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', letterSpacing: '0.01em' }}
        onClick={() => setShowInfoPage(true)}
        title="About this project"
        aria-label="About this project"
        type="button"
      >
        <span>i</span>
        <span className="hidden sm:inline">Info</span>
      </button>
      {/* Info Fullscreen Page */}
      {showInfoPage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setShowInfoPage(false)} tabIndex={-1} aria-label="Close info overlay" />
          <div className="relative flex flex-col items-center w-full max-w-2xl mx-4 p-0">
            <div className="w-full bg-white/95 dark:bg-[var(--md3-surface)] rounded-2xl shadow-2xl px-10 py-10 border-0 flex flex-col animate-scale-fade-in relative">
              <button
                onClick={() => setShowInfoPage(false)}
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
              <div className="mt-2 text-xs text-gray-400 dark:text-[var(--md3-secondary)] text-center">Stable Diffusion XL via Vercel serverless proxy.<br/>Made with <span className="text-pink-500">♥</span>.</div>
            </div>
          </div>
        </div>
      )}
      {/* --- Controls Sidebar --- */}
      <aside className="w-full md:w-96 md3-surface p-4 space-y-4 flex-shrink-0 flex flex-col">
        <header>
          <h1 className="md3-section-title">SD 3.5 Ultra</h1>
          <p className="text-[var(--md3-secondary)] mb-6">Text-to-Image Generator</p>
        </header>

        {/* --- Form Controls --- */}
        <div className="space-y-6 flex-1">
          {/* Prompt Input */}
          <div>
            <label htmlFor="prompt" className="md3-label">Prompt</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A futuristic cityscape at sunset, neon lights reflecting on wet streets"
              className="w-full h-20 md3-input scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            />
          </div>

          {/* Negative Prompt Input */}
          <div>
            <label htmlFor="negative-prompt" className="md3-label">Negative Prompt</label>
            <textarea
              id="negative-prompt"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Things to avoid in the image"
              className="w-full h-14 md3-input scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            />
          </div>

          {/* Style Preset Dropdown */}
          <div>
            <label htmlFor="style-preset" className="md3-label">Style</label>
            <select
              id="style-preset"
              value={stylePreset}
              onChange={(e) => setStylePreset(e.target.value)}
              className="w-full md3-input"
            >
              {stylePresets.map(style => <option key={style} value={style}>{style.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>

          {/* Aspect Ratio Selection */}
          <div>
            <label className="md3-label mb-2 ">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2">
              {aspectRatios.map(ratio => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`md3-tab${aspectRatio === ratio ? ' selected' : ''}`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateImage}
          disabled={isLoading}
          className="md3-btn w-full flex items-center justify-center mt-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <GenerateIcon />
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </aside>

      {/* --- Main Content Area for Image Display --- */}
      <main className="flex-1 p-4 flex items-center justify-center bg-[var(--md3-bg)] ">
        <div className="w-full h-full max-w-5xl max-h-[70vh] flex items-center justify-center">
          {isLoading && <Spinner />}
          {error && !isLoading && <ErrorDisplay message={error} />}
          {!isLoading && !error && generatedImage && (
            <div className="md3-card w-full h-full max-w-4xl max-h-full flex flex-col">
              {/* Image Container */}
              <div className="flex-1 flex items-center justify-center relative overflow-hidden rounded-lg">
                <img 
                  src={generatedImage} 
                  alt="Generated by AI" 
                  className="max-w-full max-h-full object-fit rounded-lg"
                />
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={copyPrompt}
                    className="md3-btn-icon"
                    title="Copy Prompt"
                  >
                    <CopyIcon />
                  </button>
                  {generatedImage && (
                    <a
                      href={generatedImage}
                      download={`generated-image-${Date.now()}.png`}
                      className="md3-btn-icon"
                      title="Download Image"
                    >
                      <DownloadIcon />
                    </a>
                  )}
                  <button
                    onClick={toggleFullscreen}
                    className="md3-btn-icon"
                    title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
                  >
                    {isFullscreen ? <CloseIcon /> : <ViewIcon />}
                  </button>
                </div>

                {/* Info Chips */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  <div className="md3-chip">
                    <span className="text-xs font-medium">Style: {generatedImageData?.stylePreset?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'}</span>
                  </div>
                  <div className="md3-chip">
                    <span className="text-xs font-medium">Ratio: {generatedImageData?.aspectRatio || 'N/A'}</span>
                  </div>
                  <div className="md3-chip">
                    <span className="text-xs font-medium">SD 3.5 Ultra</span>
                  </div>
                  <div className="md3-chip">
                    <span className="text-xs font-medium">Prompt: {generatedImageData?.prompt ? (generatedImageData.prompt.length > 30 ? generatedImageData.prompt.substring(0, 30) + '...' : generatedImageData.prompt) : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!isLoading && !error && !generatedImage && <ImagePlaceholder />}
        </div>
      </main>

      {/* Fullscreen Modal */}
      {isFullscreen && generatedImage && (
        <div
          className="fixed inset-0 bg-opacity-90 z-50 flex items-center justify-center p-4 fullscreen-modal overflow-auto"
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          <div className="relative max-w-full max-h-full shadow-2xl rounded-xl bg-[var(--md3-surface)] p-2 overflow-hidden">
            <img 
              src={generatedImage} 
              alt="Generated by AI" 
              className="max-w-[100vw] max-h-[100vh] object-contain rounded-lg"
            />
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 md3-btn-icon bg-black bg-opacity-50 hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-[var(--md3-primary)]"
              title="Close"
              aria-label="Close fullscreen image"
              autoFocus
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 md3-surface border border-[var(--md3-primary)] px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-2">
          <p className="text-[var(--md3-text)] text-sm">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}

export default App;
