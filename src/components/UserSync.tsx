// src/components/UserSync.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import { toast } from '@/hooks/use-toast';

export default function UserSync() {
  const { isSignedIn, isLoaded } = useAuth();
  const [hasSynced, setHasSynced] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  useEffect(() => {
    const syncUser = async () => {
      // Only attempt to sync if the user is signed in
      if (!isLoaded || !isSignedIn || hasSynced) return;
      
      setSyncStatus('syncing');
      console.log('Attempting to sync user...');
      
      try {
        await api.syncUser();
        console.log('User sync successful');
        setHasSynced(true);
        setSyncStatus('success');
        toast({
          title: 'Account Synced',
          description: 'Your account has been successfully synced.',
        });
      } catch (error) {
        console.error('Failed to sync user:', error);
        setSyncStatus('error');
        toast({
          title: 'Sync Error',
          description: 'Failed to sync your account. Some features may be limited.',
          variant: 'destructive',
        });
      }
    };

    syncUser();
  }, [isSignedIn, isLoaded, hasSynced]);

  // For debugging only - remove in production
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-md text-xs opacity-50 hover:opacity-100 transition-opacity">
        Auth: {isLoaded ? (isSignedIn ? 'Signed In' : 'Signed Out') : 'Loading...'}
        <br />
        Sync: {syncStatus}
      </div>
    );
  }

  return null;
}