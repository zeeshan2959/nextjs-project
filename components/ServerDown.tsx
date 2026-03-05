import { ServerCrash } from 'lucide-react';

export default function ServerDown() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
        <ServerCrash className="w-8 h-8 text-red-400" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Server is offline</h2>
        <p className="text-white/40 text-sm max-w-xs">
          The API server isn&apos;t reachable. Please try again later or refresh the page.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
      >
        Retry
      </button>
    </div>
  );
}
