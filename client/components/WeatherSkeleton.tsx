export default function WeatherSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Current weather skeleton */}
      <div className="bg-carbon-gray-100 p-8 sm:p-12">
        {/* Location bar */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-3 w-3 bg-carbon-gray-80 rounded-full" />
          <div className="h-3 w-32 bg-carbon-gray-80 rounded" />
          <div className="h-3 w-16 bg-carbon-gray-80 rounded" />
        </div>

        {/* Temperature */}
        <div className="flex items-start gap-6">
          <div>
            <div className="h-24 w-48 bg-carbon-gray-80 rounded mb-3" />
            <div className="h-5 w-36 bg-carbon-gray-80 rounded mb-2" />
            <div className="h-4 w-28 bg-carbon-gray-80 rounded" />
          </div>
          <div className="hidden sm:block h-24 w-24 bg-carbon-gray-80 rounded-full mt-2" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-0 mt-10 border-t border-carbon-gray-80">
          {[0, 1, 2].map((i) => (
            <div key={i} className="py-4 pr-6">
              <div className="h-3 w-20 bg-carbon-gray-80 rounded mb-2" />
              <div className="h-6 w-16 bg-carbon-gray-80 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Forecast grid skeleton */}
      <div className="bg-white border-t border-carbon-gray-20">
        <div className="px-6 py-4 border-b border-carbon-gray-20">
          <div className="h-3 w-28 bg-carbon-gray-20 rounded" />
        </div>
        <div className="grid grid-cols-5 divide-x divide-carbon-gray-20">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center py-6 px-2 gap-3">
              <div className="h-3 w-8 bg-carbon-gray-20 rounded" />
              <div className="h-8 w-8 bg-carbon-gray-20 rounded" />
              <div className="h-2 w-16 bg-carbon-gray-20 rounded hidden sm:block" />
              <div className="h-4 w-10 bg-carbon-gray-20 rounded" />
              <div className="h-1 w-full bg-carbon-gray-20" />
              <div className="h-4 w-10 bg-carbon-gray-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
