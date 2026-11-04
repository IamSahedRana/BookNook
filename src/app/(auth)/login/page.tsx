import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getSafeRedirect } from "@/lib/auth-redirect";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <AuthShell variant="login">
      <LoginForm redirectTo={getSafeRedirect(redirect)} />
    </AuthShell>
  );
}
