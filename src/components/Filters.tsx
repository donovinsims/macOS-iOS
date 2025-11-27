"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const categories = [
  "All",
  "Productivity",
  "Design",
  "Development",
  "Media",
  "Utilities",
  "Browser",
];

const platforms = [
  { label: "All Platforms", value: "" },
  { label: "macOS", value: "macOS" },
  { label: "iOS", value: "iOS" },
];

export function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "All";
  const currentPlatform = searchParams.get("platform") || "";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/?${params.toString()}`);
  };

  const handlePlatformChange = (platform: string) => {
    const params = new URLSearchParams(searchParams);
    if (platform === "") {
      params.delete("platform");
    } else {
      params.set("platform", platform);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="w-full space-y-6 mb-12">
      {/* Platform Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center p-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          {platforms.map((platform) => (
            <button
              key={platform.label}
              onClick={() => handlePlatformChange(platform.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                currentPlatform === platform.value
                  ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              {platform.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryChange(category)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-colors border",
              currentCategory === category
                ? "bg-black dark:bg-white text-white dark:text-black border-transparent"
                : "bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
            )}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
