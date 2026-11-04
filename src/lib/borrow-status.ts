const DAY_MS = 24 * 60 * 60 * 1000;

export type DueTone = "overdue" | "soon" | "normal";

export type DueStatus = {
  tone: DueTone;
  /** "Due in 3 days", "Due today", "Overdue by 2 days" */
  label: string;
  /** Needs attention: due within 2 days (or already late) */
  dueSoon: boolean;
};

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** `now` is passed in (see useNow) so components stay pure. No late fees: overdue is only a reminder. */
export function getDueStatus(returnDate: string, now: number): DueStatus {
  const diff = new Date(returnDate).getTime() - now;

  if (diff < 0) {
    const days = Math.max(1, Math.ceil(-diff / DAY_MS));
    return { tone: "overdue", label: `Overdue by ${plural(days, "day")}`, dueSoon: true };
  }
  if (diff < DAY_MS) {
    return { tone: "soon", label: "Due today", dueSoon: true };
  }
  const days = Math.ceil(diff / DAY_MS);
  return { tone: days <= 2 ? "soon" : "normal", label: `Due in ${plural(days, "day")}`, dueSoon: days <= 2 };
}
