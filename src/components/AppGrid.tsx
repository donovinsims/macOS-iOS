"use client";

import { App, AppCard } from "@/components/AppCard";

interface AppGridProps {
  apps: App[];
  isLoading?: boolean;
}

export function AppGrid({ apps, isLoading }: AppGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-[280px] rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
          No apps found
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
          We couldn't find any apps matching your criteria. Try adjusting your filters or search term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {apps.map((app, index) => (
        <AppCard key={app.id} app={app} index={index} />
      ))}
    </div>
  );
}
