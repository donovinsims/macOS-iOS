"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Menu, User, LogOut, Settings, Bookmark } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession, authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    localStorage.removeItem("bearer_token");
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "Discover" },
    { href: "/?platform=macOS", label: "macOS" },
    { href: "/?platform=iOS", label: "iOS" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 border-b border-transparent",
        isScrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-zinc-200 dark:border-zinc-800"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl tracking-tight">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <div className="w-3 h-3 bg-white dark:bg-black rounded-full" />
          </div>
          <span className="hidden sm:inline-block">AppDirectory</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-black dark:hover:text-white",
                pathname === link.href && "text-black dark:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
          {session && (
            <Link
              href="/bookmarks"
              className={cn(
                "transition-colors hover:text-black dark:hover:text-white flex items-center gap-1.5",
                pathname === "/bookmarks" && "text-black dark:text-white"
              )}
            >
              <Bookmark className="h-4 w-4" />
              Bookmarks
            </Link>
          )}
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center relative max-w-xs w-full">
          <Search className="absolute left-3 h-4 w-4 text-zinc-500" />
          <Input
            type="search"
            placeholder="Search apps..."
            className="pl-9 h-9 bg-zinc-100 dark:bg-zinc-900 border-transparent focus-visible:ring-1 focus-visible:ring-zinc-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                    <span className="font-medium text-sm">
                      {session.user.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/bookmarks" className="cursor-pointer">
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span>Bookmarks</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 p-0">
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-semibold text-lg">Menu</span>
                </div>
                
                <form onSubmit={handleSearch} className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    type="search"
                    placeholder="Search apps..."
                    className="pl-9 bg-zinc-100 dark:bg-zinc-900 border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  {session && (
                    <Link
                      href="/bookmarks"
                      className="text-lg font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Bookmark className="h-5 w-5" />
                      Bookmarks
                    </Link>
                  )}
                  
                  {!session && (
                    <>
                      <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
                      <Link
                        href="/login"
                        className="text-lg font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="text-lg font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                  
                  {session && (
                    <>
                       <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
                       <Link
                        href="/settings"
                        className="text-lg font-medium text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="text-lg font-medium text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}