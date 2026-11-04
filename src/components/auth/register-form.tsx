"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/shared/icon";
import { useRedirectIfAuthenticated } from "@/hooks/use-redirect-if-authenticated";
import { authClient } from "@/lib/auth-client";
import { withRedirect } from "@/lib/auth-redirect";
import { DEV_HINT } from "@/lib/constants";
import { notify } from "@/lib/toast";
import { registerSchema, type RegisterValues } from "@/lib/validations";
import { AuthField } from "./auth-field";
import { GoogleButton } from "./google-button";
import { PasswordRules } from "./password-rules";
import { SubmitButton } from "./submit-button";

type RegisterFormProps = {
  /** Kept so the user still lands on the page they wanted after logging in */
  redirectTo: string | null;
};

export function RegisterForm({ redirectTo }: RegisterFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", photoUrl: "", password: "" },
  });

  const password = useWatch({ control, name: "password" }) ?? "";

  // Paused while submitting: sign-up briefly creates a session that we sign out again.
  useRedirectIfAuthenticated(redirectTo ?? "/", !isSubmitting);

  async function onSubmit(values: RegisterValues) {
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      image: values.photoUrl || undefined,
    });

    if (error) {
      console.error("[register] auth error:", error);
      const code = String(error.code ?? "");
      const alreadyExists =
        code.includes("USER_ALREADY_EXISTS") ||
        /already exists/i.test(error.message ?? "");

      if (alreadyExists) {
        setError("email", { message: "An account with this email already exists." });
        notify.error(
          "Registration failed",
          "An account with this email already exists. Try logging in instead."
        );
      } else if (!error.status || error.status >= 500) {
        notify.error(
          "Something went wrong",
          `We couldn't create your account right now. Please try again in a moment.${DEV_HINT}`
        );
      } else {
        notify.error("Registration failed", error.message || "Please check your details.");
      }
      return;
    }

    // Sign-up logs the new user in. The brief wants them on the Login page, so end that session.
    await authClient.signOut();

    notify.success(
      "Account created! Please log in.",
      "Welcome to BookNook! You can now sign in with your credentials."
    );
    router.push(withRedirect("/login", redirectTo));
  }

  return (
    <>
      <div className="mb-6">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
          <Icon name="menu_book" size={16} className="text-brand" />
          New Member Registration
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-[28px] md:leading-9">
          Create Your BookNook Account
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Join our reading community in a minute.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <AuthField
          label="Full Name"
          icon="person"
          autoComplete="name"
          placeholder="Julian Vance"
          error={errors.name?.message}
          {...register("name")}
        />

        <AuthField
          label="Email Address"
          icon="mail"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthField
          label="Profile Photo URL"
          icon="image"
          type="url"
          autoComplete="off"
          placeholder="https://..."
          hint="Paste a link to your profile photo (optional)"
          error={errors.photoUrl?.message}
          {...register("photoUrl")}
        />

        <div className="space-y-2">
          <AuthField
            label="Password"
            icon="lock"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordRules password={password} />
        </div>

        <div className="pt-1">
          <SubmitButton
            loading={isSubmitting}
            idleLabel="Register"
            loadingLabel="Creating account..."
          />
        </div>
      </form>

      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="h-px w-full bg-border" />
        </div>
        <span className="relative rounded-full bg-muted px-3 py-0.5 text-xs font-semibold text-muted-foreground">
          or continue with
        </span>
      </div>

      <GoogleButton callbackURL={redirectTo ?? "/"} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?
        <Link
          href={withRedirect("/login", redirectTo)}
          className="ml-1 font-semibold text-brand hover:underline"
        >
          Login
        </Link>
      </p>
    </>
  );
}
