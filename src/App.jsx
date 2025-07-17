import React, { useState, useCallback } from 'react';
import { config } from './config';
import InfoModal from './components/InfoModal';
import ImageDetailsModal from './components/ImageDetailsModal';
import ImagePlaceholder from './components/ImagePlaceholder';
import ErrorDisplay from './components/ErrorDisplay';
import Toast from './components/Toast';
import Loading from './components/Loading';
import { GenerateIcon, CopyIcon, DownloadIcon, ViewIcon, CloseIcon } from './components/Icons';
import SidebarControls from './components/SidebarControls';
import ImageDisplay from './components/ImageDisplay';
import FullscreenModal from './components/FullscreenModal';
import InfoChip from './components/InfoChip';

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
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  
  // State to store the actual generation parameters for the current image
  const [generatedImageData, setGeneratedImageData] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showInfoPage, setShowInfoPage] = useState(false);
  const [showImageDetails, setShowImageDetails] = useState(false);

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
  const showToastMessage = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  // Copy prompt to clipboard
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      showToastMessage('Prompt copied to clipboard!', 'success');
    } catch (err) {
      showToastMessage('Failed to copy prompt', 'error');
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
        const time =  new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        
        // Store the generation parameters for this specific image
        setGeneratedImageData({
          prompt: prompt,
          negativePrompt: negativePrompt,
          stylePreset: stylePreset,
          aspectRatio: aspectRatio,
          imageSize: imageSize,
          timestamp: time
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
      <InfoChip onClick={() => setShowInfoPage(true)} />
      {/* Info Fullscreen Page */}
      <InfoModal show={showInfoPage} onClose={() => setShowInfoPage(false)} />
      {/* Image Details Modal */}
      <ImageDetailsModal 
        show={showImageDetails} 
        onClose={() => setShowImageDetails(false)} 
        imageData={generatedImageData}
      />
      {/* --- Controls Sidebar --- */}
      <SidebarControls
        prompt={prompt}
        setPrompt={setPrompt}
        negativePrompt={negativePrompt}
        setNegativePrompt={setNegativePrompt}
        stylePreset={stylePreset}
        setStylePreset={setStylePreset}
        stylePresets={stylePresets}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        aspectRatios={aspectRatios}
        handleGenerateImage={handleGenerateImage}
        isLoading={isLoading}
      />
      {/* --- Main Content Area for Image Display --- */}
      <main className="flex-1 p-4 flex items-center justify-center bg-[var(--md3-bg)] ">
        <div className="w-full h-full max-w-5xl max-h-[70vh] flex flex-col items-center justify-center">
          {isLoading && <Loading />}
          {error && !isLoading && <ErrorDisplay message={error} />}
          {!isLoading && !error && generatedImage && (
            <ImageDisplay
              generatedImage={generatedImage}
              onShowImageDetails={() => setShowImageDetails(true)}
              onCopyPrompt={copyPrompt}
              onToggleFullscreen={toggleFullscreen}
              isFullscreen={isFullscreen}
              prompt={prompt}
            />
          )}
          {!isLoading && !error && !generatedImage && <ImagePlaceholder />}
        </div>
      </main>
      {/* Fullscreen Modal */}
      {isFullscreen && generatedImage && (
        <FullscreenModal
          generatedImage={generatedImage}
          onClose={toggleFullscreen}
        />
      )}
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: '', type: 'info' })}
          />
        </div>
      )}
    </div>
  );
}

export default App;
