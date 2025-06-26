// src/app/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ProgressDashboard from '@/components/ProgressDashboard';
import TaskGenerator from '@/components/TaskGenerator';
import TaskList from '@/components/TaskList';
import UserSync from '@/components/UserSync';
import CheckConfig from '@/app/check-config';
import { env } from '@/lib/env';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Check if Gemini API key is configured
  const isGeminiConfigured = env.isGeminiConfigured();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <UserSync />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Dashboard</h1>
      </div>
      
      <ProgressDashboard />
      
      {!isGeminiConfigured && (
        <div className="mb-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Gemini API Key Required</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
              To use AI task generation, you need to set up your Gemini API key. The environment variable name should be <code className="bg-yellow-100 dark:bg-yellow-900 px-1 py-0.5 rounded">GEMINI_API_KEY</code>.
            </p>
            <Link 
              href="https://ai.google.dev/" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Get a free API key from Google AI Studio <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <CheckConfig />
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <TaskGenerator />
        <div className="space-y-4">
          <TaskList />
        </div>
      </div>
    </div>
  );
}