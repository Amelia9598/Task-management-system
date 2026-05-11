import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Create Account - TaskFlow",
  description: "Create a new TaskFlow account",
};

export default async function RegisterPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <RegisterForm />
    </main>
  );
}
