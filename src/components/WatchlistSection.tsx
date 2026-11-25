"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Globe2, Layers } from "lucide-react";
import type { WatchlistElection } from "@/lib/schemas";

const STATUS_CONFIG = {
  priority: {
    label: "Phase 1 Priority",
    classes: "border-live-border bg-live-bg text-live-text",
  },
  scheduled: {
    label: "Date Set",
    classes: "border-brand/40 bg-brand/10 text-brand",
  },
  window: {
    label: "Expected Window",
    classes: "border-border bg-surface-2 text-muted",
  },
} as const;

export function WatchlistSection({
  elections,
}: {
  elections: WatchlistElection[];
}) {
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  const regions = ["All", ...Array.from(new Set(elections.map((e) => e.region)))];
  const filtered =
    selectedRegion === "All"
      ? elections
      : elections.filter((e) => e.region === selectedRegion);

  return (
    <section id="watchlist" className="scroll-mt-24 py-14 sm:py-16">
      <div className="flex flex-col gap-5 border-b border-border/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-brand uppercase">
            <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Global 2027 Calendar Preview</span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Upcoming 2027 Election Watchlist
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Built directly from{" "}
            <code className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs text-brand">
              data/elections/2027-watchlist.json
            </code>
            . Dedicated country hubs and full calendar filtering arrive in Phase 1.
          </p>
        </div>

        {/* Region filter pills */}
        <div
          role="tablist"
          aria-label="Filter 2027 elections by region"
          className="flex flex-wrap gap-1.5"
        >
          {regions.map((region) => {
            const count =
              region === "All"
                ? elections.length
                : elections.filter((e) => e.region === region).length;
            const active = selectedRegion === region;
            return (
              <button
                key={region}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedRegion(region)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? "border-brand bg-brand text-brand-contrast"
                    : "border-border bg-surface text-muted hover:border-brand/60 hover:text-text"
                }`}
              >
                <span>{region}</span>
                <span
                  className={`tabular-nums rounded px-1.5 py-0.2 text-[10px] ${
                    active ? "bg-black/15" : "bg-bg text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Watchlist cards */}
      <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((election) => {
          const badge = STATUS_CONFIG[election.status];
          const isPriority = election.status === "priority";
          return (
            <article
              key={election.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-colors ${
                isPriority
                  ? "border-live-border bg-surface shadow-lg shadow-black/10"
                  : "border-border bg-surface/90 hover:border-brand/50"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-display tabular-nums flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg text-xs font-bold text-text">
                      {election.countryCode}
                    </span>
                    <div>
                      <div className="text-xs font-medium text-muted">
                        {election.region} &bull; {election.type}
                      </div>
                      <h3 className="font-display text-base font-bold text-text">
                        {election.country}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badge.classes}`}
                  >
                    {badge.label}
                  </span>
                </div>

                <h4 className="font-display mt-4 text-lg font-semibold leading-snug text-text">
                  {election.title}
                </h4>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5 font-medium text-text">
                    <CalendarDays className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                    <span className="tabular-nums">{election.dateDisplay}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                    <span>{election.system}</span>
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {election.summary}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3.5 text-xs">
                <span className="truncate font-mono text-[11px] text-muted">
                  {election.plannedRoute}
                </span>
                {isPriority ? (
                  <Link
                    href="/france"
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-brand/50 bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand transition-colors hover:bg-brand hover:text-brand-contrast"
                  >
                    <span>France Hub</span>
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                ) : (
                  <span className="shrink-0 rounded-md border border-border bg-bg px-2 py-0.5 text-[10px] font-semibold text-muted">
                    Planned
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
