"use client";

import { useEffect, useState } from "react";

/** The current time, refreshed every minute (keeps "Due in 2 days" labels correct without reloads). */
export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
