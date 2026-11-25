"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const current = root.dataset.theme === "light" ? "light" : "dark";
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    root.style.colorScheme = next;
    try {
      window.localStorage.setItem("we-theme", next);
    } catch {
      // Ignore storage failures in restricted browsing contexts
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Switch color theme between dark indigo and light mode"
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-text transition-colors hover:border-brand/70 hover:bg-surface-2 cursor-pointer"
    >
      <span className="theme-when-dark items-center gap-1.5">
        <Moon className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
        <span>Dark</span>
      </span>
      <span className="theme-when-light items-center gap-1.5">
        <Sun className="h-3.5 w-3.5 text-live" aria-hidden="true" />
        <span>Light</span>
      </span>
    </button>
  );
}
