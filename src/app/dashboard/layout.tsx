// src/app/dashboard/layout.tsx
import { UserButton } from '@clerk/nextjs';
import Providers from '@/app/providers';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto flex justify-between items-center py-4">
            <h1 className="text-xl font-bold">Task Manager</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
        <main>{children}</main>
        <Toaster />
      </div>
    </Providers>
  );
}