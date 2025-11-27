"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function Hero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const debouncedQuery = useDebounce(query, 500);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only push if the query has changed from what's in the URL
    if (debouncedQuery !== (searchParams.get("search") || "")) {
      const params = new URLSearchParams(searchParams);
      if (debouncedQuery) {
        params.set("search", debouncedQuery);
      } else {
        params.delete("search");
      }
      router.push(`/?${params.toString()}`);
    }
  }, [debouncedQuery, router, searchParams]);

  return (
    <section className="relative pt-32 pb-16 px-4 overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-zinc-100 to-transparent dark:from-zinc-900/50 blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto max-w-4xl text-center space-y-8">
        <motion.h1
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white !whitespace-pre-line">The Best  

          <span className="text-zinc-400 dark:text-zinc-600 !whitespace-pre-line">Free Apps</span>
        </motion.h1>

        <motion.p
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">

          Discover the finest collection of free, high-quality applications designed to elevate your productivity and creativity.
        </motion.p>

        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto relative">

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <Input
                type="search"
                placeholder="Search for apps like 'Arc' or 'Notion'..."
                className="w-full pl-12 h-14 rounded-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 text-base shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)} />

            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}