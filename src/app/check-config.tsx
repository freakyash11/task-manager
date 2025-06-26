'use client';

import { useEffect, useState } from 'react';
import { env } from '@/lib/env';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ConfigStatus = 'ok' | 'warning' | 'error';

interface ConfigItem {
  name: string;
  status: ConfigStatus;
  message: string;
  help?: string;
}

export default function CheckConfig() {
  const [configItems, setConfigItems] = useState<ConfigItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Check configuration on client side
    const items: ConfigItem[] = [];

    // Check database configuration
    if (!env.isDatabaseConfigured()) {
      items.push({
        name: 'Database',
        status: 'error',
        message: 'DATABASE_URL is not configured',
        help: 'Create a .env.local file in the root directory with DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager"'
      });
    } else {
      items.push({
        name: 'Database',
        status: 'ok',
        message: 'Database URL is configured',
      });
    }

    // Check Clerk authentication
    if (!env.isClerkConfigured()) {
      items.push({
        name: 'Authentication',
        status: 'error',
        message: 'Clerk API keys are not configured',
        help: 'Add CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env.local file'
      });
    } else {
      items.push({
        name: 'Authentication',
        status: 'ok',
        message: 'Clerk authentication is configured',
      });
    }

    // Check Gemini API
    if (!env.isGeminiConfigured()) {
      items.push({
        name: 'AI Features',
        status: 'warning',
        message: 'Gemini API key is missing - task generation will not work',
        help: 'Add GEMINI_API_KEY to your .env.local file. Get an API key from https://ai.google.dev/'
      });
    } else {
      items.push({
        name: 'AI Features',
        status: 'ok',
        message: 'Gemini API is configured',
      });
    }

    setConfigItems(items);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  const hasErrors = configItems.some(item => item.status === 'error');
  const hasWarnings = configItems.some(item => item.status === 'warning');

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {hasErrors ? (
            <XCircle className="h-5 w-5 text-destructive" />
          ) : hasWarnings ? (
            <AlertTriangle className="h-5 w-5 text-warning" />
          ) : (
            <CheckCircle className="h-5 w-5 text-success" />
          )}
          Configuration Status
        </CardTitle>
        <CardDescription>
          {hasErrors 
            ? 'Some required configuration is missing'
            : hasWarnings
              ? 'Application will work but with limited features'
              : 'All systems are properly configured'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {configItems.map((item, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{item.name}</span>
              <Badge
                variant={
                  item.status === 'ok' 
                    ? 'default' 
                    : item.status === 'warning' 
                      ? 'outline' 
                      : 'destructive'
                }
              >
                {item.message}
              </Badge>
            </li>
          ))}
        </ul>
        
        {showHelp && (
          <div className="mt-4 p-3 bg-muted rounded-md text-sm">
            <h3 className="font-medium mb-2 flex items-center gap-1">
              <Info className="h-4 w-4" />
              How to fix these issues
            </h3>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Create a <code className="bg-background px-1 rounded">.env.local</code> file in the root directory</li>
              <li>Add the following environment variables:
                <pre className="bg-background p-2 rounded mt-1 overflow-x-auto">
                  {`# Database configuration
DATABASE_URL="postgresql://username:password@localhost:5432/taskmanager"

# Clerk authentication
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Gemini API
GEMINI_API_KEY=your_gemini_api_key`}
                </pre>
              </li>
              <li>Restart your Next.js server</li>
            </ol>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowHelp(!showHelp)}
          className="w-full"
        >
          {showHelp ? 'Hide Help' : 'Show Help'}
        </Button>
      </CardFooter>
    </Card>
  );
} 