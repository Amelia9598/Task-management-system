import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Sign In - TaskFlow",
  description: "Sign in to your TaskFlow account",
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <LoginForm />
    </main>
  );
}
