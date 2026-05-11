import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import {
  CheckCircle2,
  Filter,
  ListTodo,
  Lock,
  Zap,
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="container px-4 md:px-6 py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground">
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Task Management System,{" "}
              <span className="text-primary">boost your productivity</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty">
              TaskFlow helps you manage your daily tasks with ease. Create, organize,
              and track your progress - all in one simple interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/30">
          <div className="container px-4 md:px-6 py-16 md:py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Everything you need to stay organized
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                TaskFlow provides all the essential features to help you manage your
                tasks effectively.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={ListTodo}
                title="Task Management"
                description="Create, edit, and organize tasks with titles, descriptions, and due dates."
              />
              <FeatureCard
                icon={CheckCircle2}
                title="Status Tracking"
                description="Track progress with pending, in-progress, and completed status indicators."
              />
              <FeatureCard
                icon={Filter}
                title="Smart Filtering"
                description="Filter and sort tasks by status, priority, or due date to focus on what matters."
              />
              <FeatureCard
                icon={Lock}
                title="Secure & Private"
                description="Your tasks are protected with secure authentication and encrypted storage."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t">
          <div className="container px-4 md:px-6 py-16 md:py-24">
            <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight">
                Ready to get organized?
              </h2>
              <p className="text-muted-foreground">
                Start managing your tasks today. It&apos;s free to get started.
              </p>
              <Button size="lg" asChild>
                <Link href="/register">Create Your Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            <span className="font-semibold">TaskFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with Next.js and MongoDB
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
