export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-surface/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-8 py-6 shadow-sm">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-outline-variant border-t-primary" />
        <p className="text-sm font-medium text-on-surface-variant">Loading...</p>
      </div>
    </div>
  );
}