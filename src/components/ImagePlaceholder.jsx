import React from 'react'

// Placeholder for the image area
const ImagePlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-full w-full text-center md3-surface border-2 border-dashed border-[var(--md3-border)] p-2">
      <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      <h3 className="font-semibold">Your Image Will Appear Here</h3>
      <p className="text-sm">Enter a prompt and click "Generate" to create an image.</p>
    </div>
  );

export default ImagePlaceholder