import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ListTodo, Brain } from "lucide-react";
import { DashboardButton } from "@/components/DashboardButton";
import { FooterDashboardLink } from "@/components/FooterDashboardLink";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Manage Tasks <span className="text-primary">Efficiently</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple yet powerful task manager with AI assistance to help you stay organized and productive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <DashboardButton />
            <Link href="/sign-up">
              <Button variant="outline" size="lg" className="font-medium">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ListTodo className="h-10 w-10 text-primary" />}
              title="Task Management"
              description="Create, organize, and track your tasks with an intuitive interface."
            />
            <FeatureCard 
              icon={<Brain className="h-10 w-10 text-primary" />}
              title="AI Task Generation"
              description="Let AI help you break down complex projects into manageable tasks."
            />
            <FeatureCard 
              icon={<CheckCircle className="h-10 w-10 text-primary" />}
              title="Progress Tracking"
              description="Monitor your productivity with visual progress indicators."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-muted-foreground">
            Sign up now and start managing your tasks more efficiently.
          </p>
          <div className="pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="font-medium">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Task Manager. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
            <FooterDashboardLink />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-background rounded-lg p-6 shadow-sm border">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
