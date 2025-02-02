const LoadingSpinner = () => (
  <div className="flex my-10 justify-center items-center">
    {/* <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary"></div> */}
    <span class="relative flex size-8">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
        <span class="relative inline-flex size-8 rounded-full bg-blue-600"></span>
    </span>
  </div>
);

export default LoadingSpinner;