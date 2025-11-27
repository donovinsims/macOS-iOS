"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AppCard, type App as AppCardApp } from "@/components/AppCard";
import { Bookmark, Loader2 } from "lucide-react";

interface BookmarkWithApp {
  id: number;
  userId: string;
  appId: number;
  createdAt: string;
  app: AppCardApp;
}

export default function BookmarksPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkWithApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login?redirect=/bookmarks");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      fetchBookmarks();
    }
  }, [session]);

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearer_token");
      const res = await fetch("/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const normalized: BookmarkWithApp[] = (data as BookmarkWithApp[]).map(
          (bookmark) => ({
            ...bookmark,
            app: {
              ...bookmark.app,
              screenshots: bookmark.app.screenshots ?? undefined,
            },
          })
        );
        setBookmarks(normalized);
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmarkRemoved = (appId: number) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.app.id !== appId));
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
              <Bookmark className="h-6 w-6 text-zinc-900 dark:text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                My Bookmarks
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-1">
                Apps you've saved for later
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-6">
              <Bookmark className="h-10 w-10 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">
              No bookmarks yet
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
              Start exploring and bookmark your favorite apps to keep them organized in one place.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Discover Apps
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              {bookmarks.length} {bookmarks.length === 1 ? "app" : "apps"} saved
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookmarks.map((bookmark, index) => (
                <AppCard
                  key={bookmark.app.id}
                  index={index}
                  app={bookmark.app}
                  onBookmarkChange={() => handleBookmarkRemoved(bookmark.app.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
