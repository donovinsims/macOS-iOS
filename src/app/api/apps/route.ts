import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { apps } from '@/db/schema';
import { eq, like, and, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // Single app by slug
    if (slug) {
      const app = await db.select()
        .from(apps)
        .where(eq(apps.slug, slug))
        .limit(1);

      if (app.length === 0) {
        return NextResponse.json({ error: 'App not found' }, { status: 404 });
      }

      return NextResponse.json(app[0], { status: 200 });
    }

    // List apps with filters
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const search = searchParams.get('search');
    const platform = searchParams.get('platform');
    const category = searchParams.get('category');

    // Validate limit
    let limit = 20; // default
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return NextResponse.json({ 
          error: 'Invalid limit parameter. Must be a positive number.',
          code: 'INVALID_LIMIT' 
        }, { status: 400 });
      }
      limit = Math.min(parsedLimit, 100); // max 100
    }

    // Validate offset
    const offset = offsetParam ? parseInt(offsetParam) : 0;
    if (isNaN(offset) || offset < 0) {
      return NextResponse.json({ 
        error: 'Invalid offset parameter. Must be a non-negative number.',
        code: 'INVALID_OFFSET' 
      }, { status: 400 });
    }

    // Validate platform if provided
    if (platform && !['macOS', 'iOS', 'Both'].includes(platform)) {
      return NextResponse.json({ 
        error: 'Invalid platform. Must be one of: macOS, iOS, Both',
        code: 'INVALID_PLATFORM' 
      }, { status: 400 });
    }

    // Build query conditions
    const conditions = [];

    // Search condition (name, developer, or description)
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

    // Platform filter
    if (platform) {
      conditions.push(eq(apps.platform, platform));
    }

    // Category filter
    if (category) {
      conditions.push(eq(apps.category, category));
    }

    // Build and execute query
    let query = db.select().from(apps);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(apps.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}