import { Icon } from "@/components/shared/icon";
import { AuthSidePanel } from "./auth-side-panel";

type AuthShellProps = {
  variant: "login" | "register";
  children: React.ReactNode;
};

/** Split-screen layout shared by Login and Register. */
export function AuthShell({ variant, children }: AuthShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] w-full flex-col lg:flex-row">
      <AuthSidePanel variant={variant} />

      <div className="relative z-10 -mt-6 flex flex-1 items-center justify-center rounded-t-3xl bg-surface px-4 pt-8 pb-12 sm:px-8 lg:mt-0 lg:w-1/2 lg:flex-none lg:rounded-none lg:p-12">
        <div className="my-auto w-full max-w-md">
          <div className="rounded-3xl bg-muted p-6 shadow-sm md:p-8">{children}</div>
          <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Icon name="verified_user" size={16} />
            Passwords are securely hashed and never stored in plain text
          </p>
        </div>
      </div>
    </div>
  );
}
