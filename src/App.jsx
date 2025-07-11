import React, { useState, useCallback } from 'react';
import { config } from './config';
import InfoModal from './components/InfoModal';
import ImagePlaceholder from './components/ImagePlaceholder';
import ErrorDisplay from './components/ErrorDisplay';
import { GenerateIcon, CopyIcon, DownloadIcon, ViewIcon, CloseIcon, Spinner } from './components/Icons';
// Removed: import AdminPanel from './components/AdminPanel';

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

  // API endpoint
  const API_URL = `${config.API_BASE_URL ?? 'https://diffusion-gen.vercel.app'}/api/generate`;
  

  // List of available style presets for the dropdown
  const stylePresets = [
    "cinematic", "photographic", "anime", "digital-art", "comic-book", 
    "fantasy-art", "analog-film", "neon-punk", "isometric", "low-poly", 
    "origami", "line-art", "modeling-compound", "pixel-art", "tile-texture"
  ];
  

  // List of available aspect ratios
  const aspectRatios = ["16:9", "1:1", "21:9", "2:3", "3:2", "4:5", "5:4", "9:16"];

  // Function to format bytes to KB/MB
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Function to get image size
  const getImageSize = async (imageUrl) => {
    try {
      // Use your proxy endpoint
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      return formatBytes(blob.size);
    } catch (error) {
      console.error('Error getting image size:', error);
      return 'N/A';
    }
  };

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
        const imageUrl = result.direct_url || result.image_url;
        setGeneratedImage(imageUrl);
        
        // Get image size
        const imageSize = await getImageSize(imageUrl);
        
        // Store the generation parameters for this specific image
        setGeneratedImageData({
          prompt: prompt,
          negativePrompt: negativePrompt,
          stylePreset: stylePreset,
          aspectRatio: aspectRatio,
          imageSize: imageSize,
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
      <InfoModal show={showInfoPage} onClose={() => setShowInfoPage(false)} />
      {/* --- Controls Sidebar --- */}
      <aside className="w-full md:w-96 md3-surface p-4 space-y-4 flex-shrink-0 flex flex-col">
        <header>
          <h1 className="md3-section-title">SD 3.5 Ultra</h1>
          <p className="text-[var(--md3-secondary)] mb-6">Text-to-Image Generator</p>
        </header>

        {/* --- Form Controls --- */}
        <div className="space-y-5 flex-1">
          {/* Prompt Input */}
          <div>
            <label htmlFor="prompt" className="md3-label">Prompt</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A futuristic cityscape at sunset, neon lights reflecting on wet streets"
              className="w-full h-20 md3-input scrollbar-hide mt-1"
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
              className="w-full h-17 md3-input scrollbar-hide mt-1"
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
              className="w-full md3-input mt-1"
            >
              {stylePresets.map(style => <option key={style} value={style}>{style.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>

          {/* Aspect Ratio Selection */}
          <div>
            <label className="md3-label mb-2 ">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2 mt-1">
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
                  loading="lazy"
                  decoding="async"
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
                      href={`/api/proxy-image?url=${encodeURIComponent(generatedImage)}`}
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
                    <span className="text-xs font-medium">Size: {generatedImageData?.imageSize || 'N/A'}</span>
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
              loading="lazy"
              decoding="async"
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
