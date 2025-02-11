import React, { useState, useEffect } from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-200">
      <div className="animate-pulse text-4xl font-bold text-blue-500">
        <div className="w-16 h-16 mx-auto border-4 border-blue-500 rounded-full flex items-center justify-center">
          <svg
            className="w-16 h-16 animate-spin"
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
        </div>
        <span className="my-4 ">Loading...</span>
      </div>
    </div>
  );
};

export default SplashScreen;