import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/db';
import { bookmarks, apps, user } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userBookmarks = await db
      .select({
        id: bookmarks.id,
        userId: bookmarks.userId,
        appId: bookmarks.appId,
        createdAt: bookmarks.createdAt,
        app: {
          id: apps.id,
          name: apps.name,
          slug: apps.slug,
          description: apps.description,
          shortDescription: apps.shortDescription,
          developer: apps.developer,
          iconUrl: apps.iconUrl,
          downloadUrl: apps.downloadUrl,
          platform: apps.platform,
          category: apps.category,
          screenshots: apps.screenshots,
          rating: apps.rating,
          reviewsCount: apps.reviewsCount,
          createdAt: apps.createdAt,
        },
      })
      .from(bookmarks)
      .leftJoin(apps, eq(bookmarks.appId, apps.id))
      .where(eq(bookmarks.userId, userId))
      .orderBy(desc(bookmarks.createdAt));

    return NextResponse.json(userBookmarks, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { appId } = body;

    if (!appId || isNaN(parseInt(String(appId)))) {
      return NextResponse.json(
        { error: 'Valid appId is required', code: 'INVALID_APP_ID' },
        { status: 400 }
      );
    }

    const appIdInt = parseInt(String(appId));

    const existingApp = await db
      .select()
      .from(apps)
      .where(eq(apps.id, appIdInt))
      .limit(1);

    if (existingApp.length === 0) {
      return NextResponse.json(
        { error: 'App not found', code: 'APP_NOT_FOUND' },
        { status: 404 }
      );
    }

    const existingBookmark = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.appId, appIdInt)))
      .limit(1);

    if (existingBookmark.length > 0) {
      return NextResponse.json(
        { error: 'Bookmark already exists', code: 'DUPLICATE_BOOKMARK' },
        { status: 409 }
      );
    }

    const newBookmark = await db
      .insert(bookmarks)
      .values({
        userId,
        appId: appIdInt,
        createdAt: new Date().toISOString(),
      })
      .returning();

    const bookmarkWithApp = await db
      .select({
        id: bookmarks.id,
        userId: bookmarks.userId,
        appId: bookmarks.appId,
        createdAt: bookmarks.createdAt,
        app: {
          id: apps.id,
          name: apps.name,
          slug: apps.slug,
          description: apps.description,
          shortDescription: apps.shortDescription,
          developer: apps.developer,
          iconUrl: apps.iconUrl,
          downloadUrl: apps.downloadUrl,
          platform: apps.platform,
          category: apps.category,
          screenshots: apps.screenshots,
          rating: apps.rating,
          reviewsCount: apps.reviewsCount,
          createdAt: apps.createdAt,
        },
      })
      .from(bookmarks)
      .leftJoin(apps, eq(bookmarks.appId, apps.id))
      .where(eq(bookmarks.id, newBookmark[0].id))
      .limit(1);

    return NextResponse.json(bookmarkWithApp[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');

    if (!appId || isNaN(parseInt(appId))) {
      return NextResponse.json(
        { error: 'Valid appId is required', code: 'INVALID_APP_ID' },
        { status: 400 }
      );
    }

    const appIdInt = parseInt(appId);

    const deleted = await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.appId, appIdInt)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Bookmark not found', code: 'BOOKMARK_NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Bookmark removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}