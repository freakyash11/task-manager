// src/lib/env.ts
import { z } from 'zod';

// Helper function to safely access environment variables
function getEnvVariable(key: string): string {
  try {
    return process.env[key] || '';
  } catch (error) {
    console.error(`Error accessing environment variable ${key}:`, error);
    return '';
  }
}

// Parsed environment with fallbacks
export const env = {
  DATABASE_URL: getEnvVariable('DATABASE_URL'),
  GEMINI_API_KEY: getEnvVariable('GEMINI_API_KEY'),
  CLERK_SECRET_KEY: getEnvVariable('CLERK_SECRET_KEY'),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: getEnvVariable('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'),
  
  // Helper functions to check if variables are set
  isDatabaseConfigured: () => !!getEnvVariable('DATABASE_URL'),
  isClerkConfigured: () => !!getEnvVariable('CLERK_SECRET_KEY') && !!getEnvVariable('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'),
  isGeminiConfigured: () => !!getEnvVariable('GEMINI_API_KEY'),
};