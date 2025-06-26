// src/lib/auth.ts
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentUser(req?: NextRequest) {
  const { userId } = req ? getAuth(req) : { userId: null };
  if (!userId) return null;

  try {
    // Try to find the user in the database
    const user = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1);
    
    // If user exists, return it
    if (user.length > 0) {
      return user[0];
    }
    
    // If user doesn't exist, create it
    console.log('User not found in database, creating new user for:', userId);
    const newUser = await db.insert(users).values({
      clerkId: userId,
      email: userId, // Using userId as email temporarily
    }).returning();
    
    return newUser[0] || null;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

export async function requireAuth(req?: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      throw new Error('Unauthorized');
    }
    return user;
  } catch (error) {
    console.error('Error in requireAuth:', error);
    throw new Error('Unauthorized');
  }
}