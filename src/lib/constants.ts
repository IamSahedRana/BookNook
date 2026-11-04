export const SITE_NAME = "BookNook";

export const CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Borrow period in days (Return Date = Borrow Date + LOAN_DAYS). */
export const LOAN_DAYS = 7;

export type NavLinkItem = { label: string; href: string; private: boolean };

export const NAV_LINKS: NavLinkItem[] = [
  { label: "Home", href: "/", private: false },
  { label: "All Books", href: "/books", private: false },
  { label: "Add Book", href: "/add-book", private: true },
  { label: "My Books", href: "/my-books", private: true },
  { label: "My Borrows", href: "/my-borrows", private: true },
];

export const CONTACT = {
  email: "hello@booknook.app",
  phone: "+880 1700 000 000",
  addressLines: ["12 Reading Lane", "Dhaka, Bangladesh"],
};

export const CATEGORY_META: Record<
  Category,
  { icon: string; blurb: string; tint: string }
> = {
  Fiction: {
    icon: "auto_stories",
    blurb: "Novels and stories",
    tint: "bg-rose-100 text-brand dark:bg-rose-950 dark:text-rose-300",
  },
  Science: {
    icon: "science",
    blurb: "Curious minds",
    tint: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  },
  History: {
    icon: "history_edu",
    blurb: "Stories of the past",
    tint: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  Kids: {
    icon: "child_care",
    blurb: "Fun for young readers",
    tint: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  Others: {
    icon: "bookmark",
    blurb: "Everything else",
    tint: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
};

/** Background photos for the Login / Register side panel (from the Stitch designs). */
export const AUTH_IMAGES = {
  login:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAehVb-0rVqU1mzrALfmQHK-kAVGA30s09iPoOCXP5LgcMbgitGLpP1myWRK7f1zzx4v2hBWzCfewppi4aix3DZdNE7BSc7YreBsjTJNIqH7cHclPqtt0sws9Sw4oKqGOBgo_oS42ZHhDUsucGDpwAoh458bUmyppZbiUcJjGT38biyMB1IBi2kpD5Ia1zagLGnMiOrq-EMsK1qvX69ZsNFCa7o2V2o74fh5RDYMfHM",
  register:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCRyAaB9ZR71EjT-l4UuFJGe6ns5dluE3WkpQQ78O9pYgNWr2puyJDyVktbLcOVEc5vtmxeWsqBitbJ6YHCr2yOUERWweQuWWvvMxihNrm_WOhYb5qZkCbyN_hQC4PfIZuPIfxRAOHn7MupbWrBrC9Jy17-b655EL6iWN-IkE2gF8udl-1XMEqtvIwBpI7uJ4r7ox8pktmrHsXEUBSYtwOVIK0fLwFKvFTZLfVGHsjE",
} as const;

/** Appended to "something went wrong" toasts while developing. */
export const DEV_HINT =
  process.env.NODE_ENV === "development"
    ? " Dev tip: open /api/health to see what is wrong."
    : "";

/** Image hosts that next.config.ts allows next/image to optimise (keep in sync). */
export const OPTIMIZED_IMAGE_HOSTS = [
  "i.ibb.co",
  "lh3.googleusercontent.com",
  "images.unsplash.com",
];
