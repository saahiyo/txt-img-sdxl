import React from 'react'

// Error message component
const ErrorDisplay = ({ message }) => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="p-2 text-center md3-surface border border-[var(--md3-primary)]">
        <h3 className="font-bold text-[var(--md3-primary)]">An Error Occurred</h3>
        <p className="text-[var(--md3-secondary)]">{message}</p>
      </div>
    </div>
  );

export default ErrorDisplay