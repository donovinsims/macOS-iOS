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

  const fallbackImages = useMemo(() => {
    const ordered: string[] = [];

    const addIfValid = (value?: string | null) => {
      if (typeof value !== "string") return;
      const trimmed = value.trim();
      if (!trimmed) return;
      if (!ordered.includes(trimmed)) {
        ordered.push(trimmed);
      }
    };

    if (Array.isArray(app.screenshots)) {
      app.screenshots.forEach((shot) => addIfValid(shot));
    } else if (typeof app.screenshots === "string") {
      addIfValid(app.screenshots);
    }

    addIfValid(app.iconUrl);
    addIfValid(placeholderImage);

    return ordered;
  }, [app.iconUrl, app.screenshots]);

  const [heroIndex, setHeroIndex] = useState(0);
  const heroImage = fallbackImages[heroIndex] || placeholderImage;

  useEffect(() => {
    setHeroIndex(0);
  }, [fallbackImages]);

  const handleImageError = () => {
    const nextIndex = heroIndex + 1;

    console.warn("AppCard hero image failed to load", {
      appId: app.id,
      appSlug: app.slug,
      attemptedUrl: heroImage,
      nextCandidate: fallbackImages[nextIndex],
    });

    if (nextIndex < fallbackImages.length) {
      setHeroIndex(nextIndex);
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
          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
            <Image
              src={heroImage}
              alt={app.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={handleImageError}
            />
            
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
