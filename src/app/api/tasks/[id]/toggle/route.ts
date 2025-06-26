// src/app/api/tasks/[id]/toggle/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { requireAuth } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    
    // First get the current task
    const currentTask = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, params.id), eq(tasks.userId, user.id)))
      .limit(1);

    if (currentTask.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Toggle completion status
    const updatedTask = await db
      .update(tasks)
      .set({ 
        completed: !currentTask[0].completed, 
        updatedAt: new Date() 
      })
      .where(and(eq(tasks.id, params.id), eq(tasks.userId, user.id)))
      .returning();

    return NextResponse.json(updatedTask[0]);
  } catch (_) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}