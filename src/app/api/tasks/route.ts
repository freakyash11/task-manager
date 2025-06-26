// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, users } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { getAuth } from '@clerk/nextjs/server';

const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  topic: z.string().optional(),
  category: z.string().optional(),
});

// GET /api/tasks
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const completed = searchParams.get('completed');

    const conditions = [eq(tasks.userId, user.id)];

    if (category) {
      conditions.push(eq(tasks.category, category));
    }

    if (completed !== null) {
      const isCompleted = completed === 'true';
      conditions.push(eq(tasks.completed, isCompleted));
    }

    const userTasks = await db.select().from(tasks).where(and(...conditions));
    return NextResponse.json(userTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Unauthorized or database error' }, { status: 401 });
  }
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  try {
    // First try to get user with requireAuth
    let user;
    try {
      user = await requireAuth(request);
    } catch (authError) {
      console.error('Auth error when creating task:', authError);
      
      // If requireAuth fails, try to create user first
      const { userId } = getAuth(request);
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // Try to find or create user
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, userId))
        .limit(1);
      
      if (existingUser.length > 0) {
        user = existingUser[0];
      } else {
        // Create new user in database
        const newUser = await db.insert(users).values({
          clerkId: userId,
          email: userId, // Using userId as email temporarily
        }).returning();
        
        if (newUser.length === 0) {
          return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }
        
        user = newUser[0];
      }
    }
    
    // Parse and validate request body
    const body = await request.json();
    const taskData = createTaskSchema.parse(body);

    // Create the task
    try {
      const newTask = await db.insert(tasks).values({
        ...taskData,
        userId: user.id,
      }).returning();

      if (newTask.length === 0) {
        return NextResponse.json({ error: 'Failed to create task in database' }, { status: 500 });
      }

      return NextResponse.json(newTask[0], { status: 201 });
    } catch (dbError) {
      console.error('Database error when creating task:', dbError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating task:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid task data', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}