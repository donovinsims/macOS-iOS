import { Hero } from "@/components/Hero";
import { Filters } from "@/components/Filters";
import { AppGrid } from "@/components/AppGrid";
import type { App as AppCardApp } from "@/components/AppCard";
import { db } from "@/db";
import { apps } from "@/db/schema";
import { like, and, eq, or, desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';

interface HomeProps {
  searchParams: {
    search?: string;
    category?: string;
    platform?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const search = searchParams.search;
  const category = searchParams.category;
  const platform = searchParams.platform;

  const conditions = [] as Array<ReturnType<typeof like> | ReturnType<typeof eq> | ReturnType<typeof or>>;

  if (search) {
    const searchTerm = `%${search}%`;
    conditions.push(
      or(
        like(apps.name, searchTerm),
        like(apps.developer, searchTerm),
        like(apps.description, searchTerm)
      )
    );
  }

  if (category && category !== 'All') {
    conditions.push(eq(apps.category, category));
  }

  if (platform) {
    conditions.push(eq(apps.platform, platform));
  }

  const results = await db
    .select()
    .from(apps)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(apps.createdAt));

  const normalizedResults: AppCardApp[] = results.map((app) => ({
    ...app,
    screenshots: Array.isArray(app.screenshots)
      ? app.screenshots
      : app.screenshots
        ? JSON.parse(app.screenshots as unknown as string)
        : undefined,
  }));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Hero />
      
      <div className="container mx-auto px-4 pb-20">
        <Filters />
        <AppGrid apps={normalizedResults} />
      </div>
    </div>
  );
}