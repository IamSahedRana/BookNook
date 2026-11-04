import { Icon } from "@/components/shared/icon";
import { Reveal } from "@/components/shared/motion-wrapper";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Find a Book",
    text: "Browse the shelves of books shared by our readers. Search by title or author, or filter by category.",
    footIcon: "check_circle",
    foot: "Free to browse",
  },
  {
    title: "Confirm Your Borrow",
    text: "Log in, open a book and confirm. It is yours for 7 days, and the copy count updates instantly.",
    footIcon: "schedule",
    foot: "7 days for every book",
  },
  {
    title: "Return When You're Done",
    text: "Finished reading? Return it from My Borrows in one click so the next reader can enjoy it.",
    footIcon: "favorite",
    foot: "Zero late fees, ever",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-borrowing-works"
      className="mt-6 w-full border-y border-border bg-surface px-4 py-16 sm:px-8"
    >
      <div className="mx-auto max-w-[1200px] text-center">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm">
          <Icon name="info" size={15} className="text-brand" />
          Effortless Community Sharing
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          How Borrowing Works
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          Simple, neighborly, and always free. Read on your terms without library cards or late
          fines.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 text-left md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.12} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-colors hover:border-brand/40">
              <span
                className={cn(
                  "mb-5 flex size-12 items-center justify-center rounded-full text-lg font-bold",
                  index === 0 ? "bg-brand-subtle text-brand" : "bg-muted text-foreground"
                )}
              >
                {index + 1}
              </span>
              <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              <div className="mt-auto flex items-center gap-2 pt-6 text-xs font-semibold text-muted-foreground">
                <Icon name={step.footIcon} size={16} className="text-brand" />
                {step.foot}
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
