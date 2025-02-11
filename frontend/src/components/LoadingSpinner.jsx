const LoadingSpinner = () => (
  <div className="flex my-10 justify-center items-center">
    {/* <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary"></div> */}
    <span className="relative flex size-8">
      <div className="animate-pulse text-2xl font-bold text-blue-500">
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
        <span className="my-4">Processing...</span>
      </div>
        
    </span>
  </div>
);

export default LoadingSpinner;