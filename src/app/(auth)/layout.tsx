import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <header className="p-4 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="text-sm text-gray-600 dark:text-gray-400 flex gap-4">
          <Link 
            href="/sign-in" 
            className="hover:text-gray-900 dark:hover:text-gray-100"
          >
            Sign In
          </Link>
          <Link 
            href="/sign-up"
            className="hover:text-gray-900 dark:hover:text-gray-100"
          >
            Sign Up
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 items-center">
          <div className="hidden md:block">
            <div className="space-y-4 p-6">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-2" />
                <h2 className="text-2xl font-bold">Task Manager</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Organize your work</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create tasks, track progress, and stay organized with our easy-to-use task management system.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">AI-powered assistance</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Generate task lists automatically with our AI-powered task generator.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Secure and reliable</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your data is secure with our reliable authentication and database systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            {children}
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Task Manager. All rights reserved.</p>
      </footer>
    </div>
  );
} 