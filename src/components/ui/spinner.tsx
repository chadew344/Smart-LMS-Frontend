export const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        {/* <p className="text-gray-600 text-sm mt-4 text-center">Loading...</p> */}
      </div>
    </div>
  );
};
