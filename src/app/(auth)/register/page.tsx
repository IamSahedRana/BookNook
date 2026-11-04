import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { getSafeRedirect } from "@/lib/auth-redirect";

export const metadata: Metadata = { title: "Register" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <AuthShell variant="register">
      <RegisterForm redirectTo={getSafeRedirect(redirect)} />
    </AuthShell>
  );
}
