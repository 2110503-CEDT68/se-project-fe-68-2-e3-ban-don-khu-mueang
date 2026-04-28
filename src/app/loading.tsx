export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface/40 backdrop-blur-md transition-all">
      <div className="flex flex-col items-center gap-6">
        {/* Zen Ripple Animation */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full animate-ping rounded-full bg-primary/20 duration-[3000ms]" />
          <div className="absolute h-12 w-12 animate-pulse rounded-full bg-primary/40 duration-[2000ms]" />
          <div className="h-4 w-4 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
        </div>
        
        <p className="animate-pulse text-xs font-light tracking-[0.2em] uppercase text-on-surface-variant/80 pt-4">
          Loading
        </p>
      </div>
    </div>
  );
}