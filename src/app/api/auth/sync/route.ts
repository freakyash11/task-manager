// src/app/api/auth/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
  import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Instead of using clerkClient, we'll just create the user in our database
    // with the available information
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (existingUser.length === 0) {
      await db.insert(users).values({
        clerkId: userId,
        email: userId, // Using userId as email temporarily since we don't have access to the email
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to sync user:', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}