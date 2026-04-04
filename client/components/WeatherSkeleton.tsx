export default function WeatherSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div
        className="relative overflow-hidden px-6 sm:px-12 pt-10 pb-8"
        style={{ background: "linear-gradient(160deg, #0f2044 0%, #1a3a6b 100%)" }}
      >
        {/* Location pill */}
        <div className="h-7 w-48 bg-white/10 rounded-full mb-8" />

        {/* Temp + icon row */}
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="h-36 w-56 bg-white/10 rounded-xl mb-3" />
            <div className="h-5 w-36 bg-white/10 rounded-lg mb-2" />
            <div className="h-4 w-28 bg-white/10 rounded-lg" />
          </div>
          <div className="hidden sm:block h-32 w-32 bg-white/10 rounded-full" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 mt-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white/8 border border-white/10 rounded-xl p-4">
              <div className="h-3 w-16 bg-white/10 rounded mb-3" />
              <div className="h-7 w-12 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Forecast skeleton */}
      <div style={{ background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)" }}>
        <div className="px-6 sm:px-12 pt-6 pb-4 flex items-center gap-3">
          <div className="h-3 w-28 bg-white/10 rounded" />
          <div className="flex-1 h-px bg-white/10" />
        </div>
        <div className="grid grid-cols-5 gap-2 px-4 sm:px-8 pb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3 bg-white/5 border border-white/8 rounded-2xl px-2 py-5">
              <div className="h-3 w-8 bg-white/10 rounded" />
              <div className="h-9 w-9 bg-white/10 rounded-lg" />
              <div className="h-2 w-14 bg-white/10 rounded hidden sm:block" />
              <div className="h-4 w-10 bg-white/10 rounded" />
              <div className="h-1.5 w-full bg-white/10 rounded-full" />
              <div className="h-4 w-8 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
