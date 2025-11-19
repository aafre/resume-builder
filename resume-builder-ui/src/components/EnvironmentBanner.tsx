export default function EnvironmentBanner() {
  // Banner disabled - clean production-ready UI
  // To re-enable for development, uncomment the code below:
  /*
  const env = import.meta.env.MODE;
  if (env === "production") return null;

  return (
    <div
      className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white text-center py-1.5 text-xs font-medium tracking-wide shadow-sm relative overflow-hidden"
      role="banner"
      aria-label="Development environment indicator"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
      <div className="relative z-10 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 bg-white/90 rounded-full animate-pulse" />
        <span className="uppercase">
          {env === "development" ? "Development" : env} Environment
        </span>
        <span className="inline-block w-2 h-2 bg-white/90 rounded-full animate-pulse" />
      </div>
    </div>
  );
  */
  return null;
}
