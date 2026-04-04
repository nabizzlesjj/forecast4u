export default function WeatherSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Current weather hero skeleton */}
      <div
        className="relative overflow-hidden px-6 sm:px-12 pt-10 pb-8"
        style={{ background: "linear-gradient(160deg, #0f2044 0%, #1a3a6b 100%)" }}
      >
        <div className="h-7 w-48 bg-white/10 rounded-full mb-8" />
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="h-36 w-56 bg-white/10 rounded-xl mb-3" />
            <div className="h-5 w-36 bg-white/10 rounded-lg mb-2" />
            <div className="h-4 w-28 bg-white/10 rounded-lg" />
          </div>
          <div className="hidden sm:block h-32 w-32 bg-white/10 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white/8 border border-white/10 rounded-xl p-4">
              <div className="h-3 w-16 bg-white/10 rounded mb-3" />
              <div className="h-7 w-12 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Hourly forecast skeleton */}
      <div style={{ background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)" }}>
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 pb-2 flex items-center gap-3">
          <div className="h-3 w-40 bg-white/10 rounded" />
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* 5 day rows */}
        <div className="pb-6 space-y-1">
          {[0, 1, 2, 3, 4].map((d) => (
            <div key={d} className="px-4 sm:px-8">
              {/* Day header */}
              <div className="flex items-baseline justify-between py-2 border-b border-white/8 mb-2">
                <div className="h-3 w-12 bg-white/10 rounded" />
                <div className="h-3 w-20 bg-white/10 rounded" />
              </div>
              {/* Hour cards strip */}
              <div className="flex gap-2 pb-3">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <div
                    key={s}
                    className="flex-shrink-0 w-[72px] h-[100px] bg-white/5 border border-white/8 rounded-xl"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
