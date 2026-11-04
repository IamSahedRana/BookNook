"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/shared/icon";
import { useRedirectIfAuthenticated } from "@/hooks/use-redirect-if-authenticated";
import { authClient } from "@/lib/auth-client";
import { withRedirect } from "@/lib/auth-redirect";
import { DEV_HINT } from "@/lib/constants";
import { notify } from "@/lib/toast";
import { loginSchema, type LoginValues } from "@/lib/validations";
import { AuthField } from "./auth-field";
import { GoogleButton } from "./google-button";
import { LoginRequiredBanner } from "./login-required-banner";
import { SubmitButton } from "./submit-button";

type LoginFormProps = {
  /** Page the user wanted before being sent to Login (already validated) */
  redirectTo: string | null;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const target = redirectTo ?? "/";
  useRedirectIfAuthenticated(target);

  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  // Info toast when we arrive from a private page
  useEffect(() => {
    if (!redirectTo) return;
    notify.info(
      "Please log in to continue",
      "Authentication required to borrow books or access your shelves.",
      { id: "login-required" }
    );
  }, [redirectTo]);

  async function onSubmit(values: LoginValues) {
    setFormError(null);

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    });

    if (error) {
      console.error("[login] auth error:", error);
      const serverProblem = !error.status || error.status >= 500;
      if (serverProblem) {
        setFormError("We couldn't reach the server. Please try again.");
        notify.error(
          "Something went wrong",
          `We couldn't log you in right now. Please try again in a moment.${DEV_HINT}`
        );
      } else {
        setFormError("Incorrect email or password. Please try again.");
        notify.error(
          "Authentication failed",
          "Incorrect email or password. Check your credentials and try again."
        );
      }
      return;
    }

    notify.success(
      "Login successful!",
      redirectTo ? "Taking you back to where you left off..." : "Welcome back to BookNook."
    );
    router.push(target);
    router.refresh();
  }

  return (
    <>
      {redirectTo && <LoginRequiredBanner redirectTo={redirectTo} />}

      <div className="mb-6">
        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-muted-foreground">
          <Icon name="lock_open" size={16} className="text-brand" />
          Member Sign In
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-[28px] md:leading-9">
          Welcome Back to BookNook
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {redirectTo
            ? "Sign in to complete your request and manage your shelves."
            : "Sign in to manage your shelves, borrows, and reading wishlist."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <AuthField
          label="Email address"
          icon="mail"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthField
          label="Password"
          icon="lock"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message ?? formError ?? undefined}
          labelRight={
            <button
              type="button"
              onClick={() =>
                notify.info(
                  "Password reset isn't available yet",
                  "Please contact support if you can't remember your password.",
                  { id: "forgot-password" }
                )
              }
              className="text-xs font-semibold text-brand hover:underline"
            >
              Forgot Password?
            </button>
          }
          {...register("password")}
        />

        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground select-none">
          <input
            type="checkbox"
            className="size-4 cursor-pointer rounded accent-[#e60023]"
            {...register("rememberMe")}
          />
          Remember this device
        </label>

        <SubmitButton
          loading={isSubmitting}
          idleLabel="Login to Account"
          loadingLabel="Logging in..."
        />
      </form>

      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="h-px w-full bg-border" />
        </div>
        <span className="relative rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-muted-foreground">
          or continue with
        </span>
      </div>

      <GoogleButton callbackURL={target} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to BookNook?
        <Link
          href={withRedirect("/register", redirectTo)}
          className="ml-1 font-semibold text-brand hover:underline"
        >
          Register here
        </Link>
      </p>
    </>
  );
}
