import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Download, Star, ExternalLink, Globe } from "lucide-react";
import { db } from "@/db";
import { apps } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScreenshotGallery } from "@/components/ScreenshotGallery";
import { BookmarkButton } from "@/components/BookmarkButton";

interface AppPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = await db.select().from(apps).where(eq(apps.slug, slug)).limit(1);

  if (!app.length) {
    return {
      title: "App Not Found",
    };
  }

  return {
    title: `${app[0].name} - Free ${app[0].platform} App`,
    description: app[0].shortDescription,
  };
}

export default async function AppPage({ params }: AppPageProps) {
  const { slug } = await params;
  const result = await db.select().from(apps).where(eq(apps.slug, slug)).limit(1);

  if (!result.length) {
    notFound();
  }

  const app = result[0];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pb-20">
      {/* Header / Breadcrumb */}
      <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link 
            href="/" 
            className="text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Directory
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Icon, Info, Actions */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-24">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative w-40 h-40 rounded-[2.5rem] overflow-hidden shadow-lg bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={app.iconUrl}
                    alt={app.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    {app.name}
                  </h1>
                  <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
                    by {app.developer}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary" className="px-3 py-1 text-sm">
                    {app.platform}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 text-sm">
                    {app.category}
                  </Badge>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-sm font-medium border border-amber-100 dark:border-amber-900/30">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {app.rating}
                  </div>
                </div>

                <div className="flex flex-col w-full gap-3 pt-4">
                  <Button className="w-full h-12 rounded-full text-base font-semibold" asChild>
                    <a href={app.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Get App
                    </a>
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-full" asChild>
                      <a href={app.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Website
                      </a>
                    </Button>
                    <div className="flex-shrink-0">
                      <BookmarkButton appId={app.id} className="h-10 w-10 border-zinc-200 dark:border-zinc-700" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Description, Screenshots */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white flex items-center gap-2">
                About
              </h2>
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {app.description}
                </p>
              </div>
            </section>

            {/* Screenshots */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-white">
                Preview
              </h2>
              {app.screenshots && (
                <ScreenshotGallery 
                  screenshots={Array.isArray(app.screenshots) ? app.screenshots : JSON.parse(app.screenshots as unknown as string)} 
                  appName={app.name} 
                />
              )}
            </section>

            {/* Stats / Details */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Reviews</div>
                <div className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {app.reviewsCount.toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">License</div>
                <div className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Free
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Added</div>
                <div className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Developer</div>
                <div className="text-xl font-semibold text-zinc-900 dark:text-white truncate">
                  {app.developer}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
