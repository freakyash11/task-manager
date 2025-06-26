// src/app/api/gemini/generate-tasks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { env } from '@/lib/env';

// Input validation schema
const generateTasksSchema = z.object({
  topic: z.string().min(1).max(100),
});

// Get API key from environment
const apiKey = env.GEMINI_API_KEY;

// Initialize Gemini AI with proper error handling
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", // Use Flash model instead of Pro for free tier
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
  } catch (error) {
    console.error("Failed to initialize Gemini API:", error);
  }
}

// Rate limiting: simple in-memory store
// In production, use Redis or a similar solution
const rateLimits = new Map<string, { count: number, resetTime: number }>();
const MAX_REQUESTS_PER_MINUTE = 10; // Free tier limit
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userRateLimit = rateLimits.get(userId);
  
  if (!userRateLimit || userRateLimit.resetTime < now) {
    // First request or reset window
    rateLimits.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (userRateLimit.count >= MAX_REQUESTS_PER_MINUTE) {
    return true; // Rate limited
  }
  
  // Increment request count
  userRateLimit.count += 1;
  rateLimits.set(userId, userRateLimit);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication directly with Clerk
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is rate limited
    if (isRateLimited(userId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' }, 
        { status: 429 }
      );
    }

    // Check if Gemini is properly initialized
    if (!genAI || !model) {
      return NextResponse.json(
        { error: 'Gemini API not properly configured' }, 
        { status: 500 }
      );
    }

    // Try to find user in database
    let dbUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)
      .then(results => results[0] || null);

    // If user doesn't exist in database, create them
    if (!dbUser) {
      await db.insert(users).values({
        clerkId: userId,
        email: userId, // Using userId as email temporarily
      });
      
      dbUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, userId))
        .limit(1)
        .then(results => results[0]);
    }
    
    // Parse and validate request body
    const body = await request.json();
    const { topic } = generateTasksSchema.parse(body);
    
    // Generate prompt for Gemini
    const prompt = `Generate 5 specific, actionable tasks for learning about or working on "${topic}". 
    Each task should be clear, concise, and focused on a single action.
    Return only the tasks as a numbered list, with no additional text.`;
    
    try {
      // Generate content with Gemini
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response into individual tasks
      const tasks = text
        .split(/\d+\./)
        .map(task => task.trim())
        .filter(task => task.length > 0);
      
      // Return the tasks
      return NextResponse.json({ tasks }, { status: 200 });
    } catch (aiError: any) {
      console.error('Gemini API error:', aiError);
      
      // Handle specific error types
      if (aiError.message?.includes('403')) {
        return NextResponse.json(
          { error: 'API key authentication failed. Make sure your Gemini API key is valid.' }, 
          { status: 403 }
        );
      }
      
      if (aiError.message?.includes('429')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' }, 
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to generate content with Gemini API' }, 
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error generating tasks:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: 'Failed to generate tasks' }, 
      { status: 500 }
    );
  }
} 