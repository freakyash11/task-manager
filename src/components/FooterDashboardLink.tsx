'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export function FooterDashboardLink() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSignedIn) {
      router.push('/dashboard');
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <a 
      href="#" 
      onClick={handleClick}
      className="text-sm text-muted-foreground hover:text-foreground"
    >
      Dashboard
    </a>
  );
} 