'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    // Only collect public environment variables (NEXT_PUBLIC_*)
    const publicEnvVars: Record<string, string> = {};
    
    // Check for Clerk public keys
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      publicEnvVars['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'] = 'Set (masked)';
    } else {
      publicEnvVars['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'] = 'Not set';
    }
    
    // Check other public env vars
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_') && key !== 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY') {
        publicEnvVars[key] = 'Set (masked)';
      }
    });
    
    setEnvVars(publicEnvVars);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables Debug</CardTitle>
          <CardDescription>
            This page shows which public environment variables are available to the client.
            Private variables are not shown for security reasons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Public Environment Variables:</h3>
              <pre className="bg-muted p-4 rounded overflow-x-auto">
                {JSON.stringify(envVars, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Next.js Configuration:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <span className="font-mono">NODE_ENV:</span> {process.env.NODE_ENV}
                </li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md text-sm">
              <h3 className="font-medium mb-2">Troubleshooting Tips:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Make sure you have a <code className="bg-muted px-1 rounded">.env.local</code> file in your project root</li>
                <li>Environment variables must be prefixed with <code className="bg-muted px-1 rounded">NEXT_PUBLIC_</code> to be accessible on the client side</li>
                <li>After changing environment variables, restart your Next.js server</li>
                <li>Check that your <code className="bg-muted px-1 rounded">next.config.js</code> is properly configured</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 