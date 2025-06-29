const PageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="w-20 h-20 border-4 border-t-transparent border-blue-500 rounded-full animate-spin shadow-lg"></div>

      <p className="mt-8 text-xl sm:text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-pulse">
        Loading CodeX...
      </p>
    </div>
  );
};

export default PageLoader;
