import { Icon } from "@/components/shared/icon";
import { AUTH_IMAGES } from "@/lib/constants";

type AuthSidePanelProps = { variant: "login" | "register" };

const BADGES = {
  login: ["Add, borrow and return books", "Zero late fees", "Free for every reader"],
  register: ["Free to join", "Borrow for 7 days", "Share your own books"],
} as const;

export function AuthSidePanel({ variant }: AuthSidePanelProps) {
  return (
    <aside className="relative flex min-h-44 flex-col justify-end overflow-hidden bg-[#111111] p-6 text-white lg:min-h-[calc(100vh-5rem)] lg:w-1/2 lg:justify-between lg:p-10">
      {/* Photo + red tinted overlays (the photo is optional: the gradients still look fine without it) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: `url('${AUTH_IMAGES[variant]}')` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-tr from-[#b7001a]/90 via-[#e60023]/50 to-[#111111]/80 mix-blend-multiply"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-transparent to-black/30"
      />

      {/* Top row (desktop only) */}
      <div className="relative z-10 hidden items-center justify-between lg:flex">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
          <span className="size-2 animate-pulse rounded-full bg-white" />
          Community Reading Nook
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-sm">
          <Icon name="local_library" size={16} />
          Open 24/7 Digital Desk
        </span>
      </div>

      {/* Quote */}
      <div className="relative z-10 max-w-xl lg:my-auto">
        <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold tracking-widest text-white/85 uppercase lg:hidden">
          <Icon name="auto_stories" size={18} filled />
          BookNook Community
        </div>
        <span className="mb-5 hidden size-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-md lg:flex">
          <Icon name="format_quote" size={26} />
        </span>
        <blockquote className="text-lg leading-snug font-semibold italic drop-shadow lg:text-5xl lg:leading-tight lg:font-bold lg:tracking-tight lg:not-italic lg:text-balance">
          “A room without books is like a body without a soul.”
        </blockquote>
        <p className="mt-1.5 text-xs font-medium text-white/80 lg:mt-4 lg:text-lg lg:text-white/90">
          — Marcus Tullius Cicero
        </p>

        <ul className="mt-8 hidden flex-wrap gap-2 lg:flex">
          {BADGES[variant].map((badge) => (
            <li
              key={badge}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md"
            >
              <span className="text-[10px] font-bold text-red-200">✦</span>
              {badge}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom row (desktop only) */}
      <div className="relative z-10 hidden items-center justify-between pt-4 text-sm text-white/75 lg:flex">
        <span>Curated by neighborhood bibliophiles</span>
        <span className="text-white/60">Vol. {new Date().getFullYear()}</span>
      </div>
    </aside>
  );
}
