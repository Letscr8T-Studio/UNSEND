import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  if (await getAdminSession()) redirect("/owner/dashboard");

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10">
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">Unsend founders</p>
        <h1 className="font-display mt-2 mb-6 text-3xl font-bold tracking-tight">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
