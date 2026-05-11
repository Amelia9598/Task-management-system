import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardContent } from "@/components/dashboard-content";
import { Header } from "@/components/header";

export const metadata = {
  title: "Dashboard - TaskFlow",
  description: "Manage your tasks",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 md:px-6 py-6">
        <DashboardContent />
      </main>
    </div>
  );
}
