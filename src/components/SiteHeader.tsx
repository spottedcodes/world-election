"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { SiteConfig } from "@/lib/schemas";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader({ config }: { config: SiteConfig }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/90 bg-bg/90 backdrop-blur-md">
      {/* Top global cycle bar */}
      <div className="border-b border-border/60 bg-surface/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-xs text-muted sm:px-6">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="animate-live-dot inline-block h-2 w-2 rounded-full bg-live"
            />
            <span className="font-medium text-live-text">
              2027 Cycle Watch
            </span>
            <span className="hidden text-border sm:inline" aria-hidden="true">
              |
            </span>
            <span className="hidden sm:inline">
              Phase 1 Target: France Presidential Election (18 Apr &amp; 2 May 2027)
            </span>
          </div>
          <span className="tabular-nums font-medium text-muted">
            UTC + Local Polling Time
          </span>
        </div>
      </div>

      {/* Primary navigation row */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-lg py-1 pr-2"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand/40 bg-surface shadow-sm transition-colors group-hover:border-brand">
            <svg
              viewBox="0 0 28 28"
              className="h-5 w-5"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="14"
                cy="14"
                r="10"
                stroke="var(--brand)"
                strokeWidth="1.75"
              />
              <ellipse
                cx="14"
                cy="14"
                rx="4.6"
                ry="10"
                stroke="var(--brand)"
                strokeWidth="1.4"
              />
              <path
                d="M4.5 14H23.5"
                stroke="var(--border)"
                strokeWidth="1.4"
              />
              <circle cx="19.5" cy="8.5" r="2.5" fill="var(--live)" />
            </svg>
          </span>
          <span className="flex flex-col">
            <span className="font-display text-lg font-bold leading-none tracking-tight text-text">
              {config.brand.name}
            </span>
            <span className="mt-0.5 text-[11px] font-medium tracking-wide text-muted">
              GLOBAL BALLOT TRACKER
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary Navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {config.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/#watchlist"
            className="hidden rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:border-brand/70 hover:bg-surface-2 sm:inline-flex"
          >
            Phase 1 Roadmap
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text md:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-surface px-4 py-3 md:hidden">
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-1">
            {config.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-text hover:bg-surface-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
