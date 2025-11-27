import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black dark:bg-white rounded-md flex items-center justify-center">
            <div className="w-2 h-2 bg-white dark:bg-black rounded-full" />
          </div>
          <span className="font-semibold text-sm tracking-tight">AppDirectory</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
            Discover
          </Link>
          <Link href="/?platform=macOS" className="hover:text-black dark:hover:text-white transition-colors">
            macOS
          </Link>
          <Link href="/?platform=iOS" className="hover:text-black dark:hover:text-white transition-colors">
            iOS
          </Link>
        </div>

        <p className="text-xs text-zinc-400 dark:text-zinc-600">
          © {new Date().getFullYear()} AppDirectory. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
