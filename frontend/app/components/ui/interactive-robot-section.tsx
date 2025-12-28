'use client';

import React, { useState, useEffect } from 'react';

// Loading component for Spline
const SplineLoader = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
    <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
    </svg>
  </div>
);

export function InteractiveRobotSection() {
  // For now, just show a placeholder since Spline import is causing build issues
  // This can be enabled later once the package import issue is resolved
  return (
    <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-16">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-slate-800 bg-gray-900 h-[560px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Interactive 3D Robot</p>
          <p className="text-gray-400 text-sm">3D visualization coming soon</p>
        </div>
      </div>
    </div>
  );
}

