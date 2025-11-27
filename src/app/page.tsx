import { Hero } from "@/components/Hero";
import { Filters } from "@/components/Filters";
import { AppGrid } from "@/components/AppGrid";
import { db } from "@/db";
import { apps } from "@/db/schema";
import { like, and, eq, or, desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';

interface HomeProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    platform?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const search = params.search;
  const category = params.category;
  const platform = params.platform;

  const conditions = [];

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

  let query = db.select().from(apps);

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const results = await query.orderBy(desc(apps.createdAt));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Hero />
      
      <div className="container mx-auto px-4 pb-20">
        <Filters />
        <AppGrid apps={results} />
      </div>
    </div>
  );
}