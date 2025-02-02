import React, { useState, useEffect } from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200">
      <div className="animate-pulse text-4xl font-bold text-blue-500">
        <svg
          className="mx-auto my-2 w-16 h-16 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
        <span className="ml-4">Loading...</span>
      </div>
    </div>
  );
};

export default SplashScreen;