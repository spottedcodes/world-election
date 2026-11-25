"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { FranceHubData } from "@/lib/schemas";

interface CountdownParts {
  days: string;
  hours: string;
  minutes: string;
}

function computeCountdown(isoTarget: string): CountdownParts {
  const diffMs = Math.max(0, new Date(isoTarget).getTime() - Date.now());
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return {
    days: String(days).padStart(3, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
  };
}

export function FranceNextElectionCard({
  nextElection,
}: {
  nextElection: FranceHubData["nextElection"];
}) {
  const [countdown, setCountdown] = useState<CountdownParts | null>(null);

  useEffect(() => {
    const sync = () => setCountdown(computeCountdown(nextElection.round1Iso));
    const init = window.setTimeout(sync, 0);
    const interval = window.setInterval(sync, 30000);
    return () => {
      window.clearTimeout(init);
      window.clearInterval(interval);
    };
  }, [nextElection.round1Iso]);

  return (
    <div className="rounded-2xl border border-live-border bg-surface p-5 shadow-xl shadow-black/15 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/80 pb-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-live-border bg-live-bg px-2.5 py-0.5 text-[11px] font-semibold text-live-text">
              <span
                aria-hidden="true"
                className="animate-live-dot h-1.5 w-1.5 rounded-full bg-live"
              />
              <span>NEXT NATIONAL VOTE</span>
            </span>
            <span className="rounded-md border border-border bg-bg px-2 py-0.5 font-mono text-[11px] text-muted">
              {nextElection.type}
            </span>
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-text sm:text-2xl">
            {nextElection.title}
          </h2>
          <p className="text-xs text-muted">
            {nextElection.system} &bull; Polls close {nextElection.pollCloseLabel}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-bg/90 px-4 py-2.5 text-right">
          <div className="flex items-center justify-end gap-1.5 text-[11px] font-medium text-muted">
            <Clock className="h-3 w-3 text-brand" aria-hidden="true" />
            <span>Round 1 Countdown</span>
          </div>
          <div className="font-display tabular-nums mt-0.5 text-xl font-bold tracking-tight text-text sm:text-2xl">
            {countdown
              ? `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`
              : "---d --h --m"}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-bg/65 px-3.5 py-3">
          <Calendar className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          <div>
            <div className="text-[11px] font-medium text-muted">First Round</div>
            <div className="font-display text-sm font-semibold text-text">
              {nextElection.round1Label}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-bg/65 px-3.5 py-3">
          <Calendar className="h-4 w-4 shrink-0 text-live" aria-hidden="true" />
          <div>
            <div className="text-[11px] font-medium text-muted">Second Round Runoff</div>
            <div className="font-display text-sm font-semibold text-text">
              {nextElection.round2Label}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
        <div className="text-xs text-muted">
          Dedicated election page:{" "}
          <code className="rounded border border-border bg-bg px-1.5 py-0.5 text-[11px] text-brand">
            {nextElection.plannedHref}
          </code>{" "}
          <span className="text-[11px]">(Phase 1)</span>
        </div>
        <Link
          href={nextElection.previewHref}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-xs font-semibold text-brand-contrast transition-colors hover:bg-brand-hover"
        >
          <span>2027 Race Preview</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
