import fs from 'fs';
import path from 'path';
import { db } from '@/db';
import { apps } from '@/db/schema';

interface ParsedApp {
    name: string;
    slug?: string;
    description: string;
    shortDescription?: string;
    developer?: string;
    iconUrl?: string;
    downloadUrl: string;
    platform?: string;
    category: string;
    price?: string;
    screenshots?: string[];
    rating?: number;
    reviewsCount?: number;
    createdAt?: string;
}

const parsedFile = path.join(process.cwd(), 'temp_apps_parsed.json');

const slugify = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const fallbackShortDescription = (description: string) =>
    description.length > 160 ? `${description.slice(0, 157).trim()}...` : description;

async function main() {
    if (!fs.existsSync(parsedFile)) {
        throw new Error(`Parsed apps JSON not found at ${parsedFile}. Run parse_table.js first.`);
    }

    const parsedApps: ParsedApp[] = JSON.parse(fs.readFileSync(parsedFile, 'utf8'));

    const existing = await db.select({ slug: apps.slug, name: apps.name }).from(apps);
    const existingSlugs = new Set(existing.map((app) => app.slug));
    const existingNames = new Set(existing.map((app) => app.name));

    const records = parsedApps.map((app) => {
        const slug = app.slug ? slugify(app.slug) : slugify(app.name);
        const screenshots = Array.isArray(app.screenshots)
            ? app.screenshots
            : app.screenshots
              ? [app.screenshots]
              : [];

        return {
            name: app.name,
            slug,
            description: app.description,
            shortDescription: app.shortDescription ?? fallbackShortDescription(app.description),
            developer: app.developer ?? `${app.name} Team`,
            iconUrl: app.iconUrl ?? screenshots[0] ?? '',
            downloadUrl: app.downloadUrl,
            platform: app.platform ?? 'macOS',
            category: app.category,
            screenshots,
            rating: app.rating ?? 4.5,
            reviewsCount: app.reviewsCount ?? 0,
            createdAt: app.createdAt ?? new Date().toISOString(),
        };
    });

    const uniqueRecords = records.filter(
        (record) => !existingSlugs.has(record.slug) && !existingNames.has(record.name),
    );

    if (!uniqueRecords.length) {
        console.log('No new apps to seed. Existing records cover the parsed data.');
        return;
    }

    await db.insert(apps).values(uniqueRecords);

    console.log(`✅ Seeded ${uniqueRecords.length} apps from parsed JSON`);
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
});
