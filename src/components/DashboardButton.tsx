'use client';

import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function DashboardButton() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <Button 
      size="lg" 
      className="font-medium" 
      onClick={handleClick}
      disabled={!isLoaded}
    >
      Go to Dashboard
    </Button>
  );
} 