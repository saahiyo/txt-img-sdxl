import React from 'react';

const InfoChip = ({ onClick }) => (
  <button
    className="fixed top-4 right-4 z-50 md3-chip flex items-center gap-2 bg-[var(--md3-surface)] border border-[var(--md3-primary)] hover:bg-[var(--md3-primary)] hover:text-white transition-colors shadow-md"
    style={{ fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', letterSpacing: '0.01em' }}
    onClick={onClick}
    title="About this project"
    aria-label="About this project"
    type="button"
  >
    <span>i</span>
    <span className="hidden sm:inline"> Info</span>
  </button>
);

export default InfoChip; 