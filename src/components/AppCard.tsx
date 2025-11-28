"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { BookmarkButton } from "@/components/BookmarkButton";
import { useEffect, useMemo, useState } from "react";

export interface App {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  developer: string;
  iconUrl: string;
  downloadUrl: string;
  platform: string;
  category: string;
  rating: number;
  reviewsCount: number;
  screenshots?: string[] | string | null;
}

interface AppCardProps {
  app: App;
  index: number;
}

export function AppCard({ app, index }: AppCardProps) {
  const placeholderImage = "/window.svg";
  const blurDataURL =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNjQnIGhlaWdodD0nNDgnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGxpbmVhckdyYWRpZW50IGlkPSdnJyB4MT0nMCUnIHkxPScwJScgeDI9JzAlJyB5Mj0nMTAwJSc+PHN0b3Agb2Zmc2V0PScwJScgc3RvcC1jb2xvcj0nI2Y2ZjZmNid2JyAvPjxzdG9wIG9mZnNldD0nMTAwJScgc3RvcC1jb2xvcj0nI2Q2ZDY2Nid2JyAvPjwvbGluZWFyR3JhZGllbnQ+PHJlY3QgeD0nMCcgeT0nMCcgd2lkdGg9JzY0JyBoZWlnaHQ9JzQ4JyBmaWxsPSd1cmwoI2cpJy8+PC9zdmc+";

  const screenshots = useMemo(() => {
    if (Array.isArray(app.screenshots)) {
      return app.screenshots.filter(Boolean);
    }

    if (typeof app.screenshots === "string" && app.screenshots.trim().length > 0) {
      return [app.screenshots];
    }

    return [];
  }, [app.screenshots]);

  const fallbackImages = useMemo(() => {
    const icon = app.iconUrl?.trim();
    const ordered = [...screenshots];

    if (icon) {
      ordered.push(icon);
    }

    ordered.push(placeholderImage);

    return Array.from(new Set(ordered.filter(Boolean)));
  }, [app.iconUrl, placeholderImage, screenshots]);

  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    setHeroImageIndex(0);
  }, [fallbackImages]);

  const heroImage = fallbackImages[heroImageIndex] ?? placeholderImage;
  const isPlaceholder = heroImage === placeholderImage;
  const useContain = isPlaceholder || heroImage === app.iconUrl;

  const handleImageError = () => {
    const nextIndex = heroImageIndex + 1;
    const hasNextImage = nextIndex < fallbackImages.length;

    console.warn("AppCard hero image failed to load", {
      appId: app.id,
      appSlug: app.slug,
      attemptedUrl: heroImage,
      nextUrl: hasNextImage ? fallbackImages[nextIndex] : placeholderImage,
    });

    if (hasNextImage) {
      setHeroImageIndex(nextIndex);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative"
    >
      <Link href={`/apps/${app.slug}`} className="block">
        <div className="relative">
          {/* Hero Image - Only this has border */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-900 shadow-sm">
            <div className="absolute inset-0 p-2">
              <Image
                src={heroImage}
                alt={app.name}
                fill
                className={`rounded-[10px] transition-transform duration-500 group-hover:scale-105 ${useContain ? "object-contain bg-white/40 dark:bg-zinc-900/40" : "object-cover"}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                placeholder="blur"
                blurDataURL={blurDataURL}
                onError={handleImageError}
              />
              <div className="pointer-events-none absolute inset-0 rounded-[10px] bg-gradient-to-b from-black/5 via-transparent to-black/10" />
            </div>

            {isPlaceholder && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                  Image not available
                </span>
              </div>
            )}

            {/* Hover Overlay with Product Information */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                  {app.category}
                </span>
              </div>
              
              {/* App Description */}
              <p className="text-white text-base font-medium leading-relaxed max-w-[90%]">
                {app.shortDescription}
              </p>
            </div>
          </div>

          {/* Content Section - Transparent, single line */}
          <div className="relative pt-2">
            <div className="flex items-center gap-2">
              <div className="min-w-0 flex-auto">
                <div className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-zinc-900 dark:text-white">
                  <span className="text-sm font-semibold align-middle">{app.name}</span>
                  <span className="mx-0.5 text-zinc-400 align-middle">·</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 align-middle">{app.category}</span>
                </div>
              </div>

              {/* Action Icons - No borders, same line */}
              <div className="flex items-center gap-4 flex-none">
                {/* Prevent navigation when clicking the bookmark */}
                <div onClick={(e) => e.preventDefault()}>
                  <BookmarkButton appId={app.id} />
                </div>
                <div className="p-0" aria-hidden>
                  <ExternalLink className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
