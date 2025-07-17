import React from 'react';
import { GenerateIcon } from './Icons';

const SidebarControls = ({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  stylePreset,
  setStylePreset,
  stylePresets,
  aspectRatio,
  setAspectRatio,
  aspectRatios,
  handleGenerateImage,
  isLoading
}) => (
  <aside className="w-full md:w-96 md3-surface p-4 space-y-4 flex-shrink-0 flex flex-col">
    <header>
      <h1 className="md3-section-title">SD 3.5 Ultra</h1>
      <p className="text-[var(--md3-secondary)] mb-6">Text-to-Image Generator</p>
    </header>
    <div className="space-y-5 flex-1">
      <div>
        <label htmlFor="prompt" className="md3-label">Prompt</label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g., A futuristic cityscape at sunset, neon lights reflecting on wet streets"
          className="w-full h-20 md3-input scrollbar-hide mt-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        />
      </div>
      <div>
        <label htmlFor="negative-prompt" className="md3-label">Negative Prompt</label>
        <textarea
          id="negative-prompt"
          value={negativePrompt}
          onChange={e => setNegativePrompt(e.target.value)}
          placeholder="Things to avoid in the image"
          className="w-full h-17 md3-input scrollbar-hide mt-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        />
      </div>
      <div>
        <label htmlFor="style-preset" className="md3-label">Style</label>
        <select
          id="style-preset"
          value={stylePreset}
          onChange={e => setStylePreset(e.target.value)}
          className="w-full md3-input mt-1"
        >
          {stylePresets.map(style => (
            <option key={style} value={style}>
              {style.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>
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
    <button
      onClick={handleGenerateImage}
      disabled={isLoading}
      className="md3-btn w-full flex items-center justify-center mt-3 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <GenerateIcon />
      {isLoading ? 'Generating...' : 'Generate'}
    </button>
  </aside>
);

export default SidebarControls; 