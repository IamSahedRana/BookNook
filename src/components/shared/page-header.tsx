import Link from "next/link";
import { Icon } from "@/components/shared/icon";
import { FadeIn } from "@/components/shared/motion-wrapper";

type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  title: string;
  description?: string;
  badge?: string;
  breadcrumb?: Crumb[];
  /** Content on the right side (e.g. a counter or a button) */
  aside?: React.ReactNode;
};

export function PageHeader({ title, description, badge, breadcrumb, aside }: PageHeaderProps) {
  return (
    <FadeIn className="mb-8">
      {breadcrumb && (
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1 text-sm font-medium text-muted-foreground"
        >
          {breadcrumb.map((crumb, index) => {
            const last = index === breadcrumb.length - 1;
            return (
              <span key={crumb.label} className="flex items-center gap-1">
                {index > 0 && <span className="text-muted-foreground/50">/</span>}
                {crumb.href && !last ? (
                  <Link
                    href={crumb.href}
                    className="flex items-center gap-1 transition-colors hover:text-foreground"
                  >
                    {index === 0 && <Icon name="home" size={18} />}
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={last ? "font-semibold text-brand" : undefined}>
                    {crumb.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      )}

      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="max-w-2xl space-y-2">
          {badge && (
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              <span className="size-2 rounded-full bg-brand" />
              {badge}
            </span>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="text-base text-muted-foreground md:text-lg">{description}</p>
          )}
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </div>
    </FadeIn>
  );
}
