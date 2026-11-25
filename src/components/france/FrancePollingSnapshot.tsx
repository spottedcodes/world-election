import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import type { FranceHubData } from "@/lib/schemas";

export function FrancePollingSnapshot({
  polling,
  previewHref,
}: {
  polling: FranceHubData["pollingSnapshot"];
  previewHref: string;
}) {
  const maxAxis = 40;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-live-border bg-live-bg px-2.5 py-0.5 text-[11px] font-semibold text-live-text">
            <BarChart3 className="h-3 w-3" aria-hidden="true" />
            <span>{polling.statusLabel}</span>
          </div>
          <h3 className="font-display text-lg font-bold text-text sm:text-xl">
            2027 First-Round Polling Snapshot
          </h3>
          <p className="max-w-2xl text-xs leading-relaxed text-muted">
            {polling.sourcesSummary}
          </p>
        </div>

        <Link
          href={previewHref}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:border-brand"
        >
          <span>Full 2027 Polls Tracker</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Horizontal range bar chart */}
      <div className="mt-5 space-y-3">
        {polling.contenders.map((contender) => {
          const leftPct = (contender.minPct / maxAxis) * 100;
          const spanPct = ((contender.maxPct - contender.minPct) / maxAxis) * 100;
          const midPct = ((contender.minPct + contender.maxPct) / 2 / maxAxis) * 100;

          return (
            <div key={contender.name} className="grid items-center gap-2 sm:grid-cols-12">
              <div className="flex items-center justify-between gap-2 sm:col-span-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-text">
                    {contender.name}
                  </div>
                  <div className="truncate text-[11px] text-muted">
                    {contender.party}
                  </div>
                </div>
                <span className="font-display tabular-nums shrink-0 text-xs font-bold text-text sm:hidden">
                  {contender.minPct.toFixed(0)}–{contender.maxPct.toFixed(1)}%
                </span>
              </div>

              <div className="relative h-5 rounded-full bg-surface-2 sm:col-span-6">
                {/* Base track to min */}
                <div
                  className="absolute top-1.5 bottom-1.5 left-0 rounded-l-full opacity-35"
                  style={{
                    width: `${Math.min(100, leftPct)}%`,
                    backgroundColor: contender.color,
                  }}
                />
                {/* Scenario range band */}
                <div
                  className="absolute top-1 bottom-1 rounded-full border border-black/20"
                  style={{
                    left: `${Math.min(98, leftPct)}%`,
                    width: `${Math.max(4, Math.min(100 - leftPct, spanPct))}%`,
                    backgroundColor: contender.color,
                  }}
                  title={`${contender.name}: ${contender.minPct}%–${contender.maxPct}%`}
                />
                {/* Midpoint marker */}
                <div
                  className="absolute top-0.5 bottom-0.5 w-0.5 bg-text"
                  style={{ left: `${Math.min(99, midPct)}%` }}
                  aria-hidden="true"
                />
              </div>

              <div className="font-display tabular-nums hidden text-right text-xs font-bold text-text sm:col-span-2 sm:block">
                {contender.minPct.toFixed(1)}–{contender.maxPct.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 rounded-xl border border-border/80 bg-bg/65 p-3 text-xs leading-relaxed text-muted">
        <strong className="text-text">Pre-nomination caveat:</strong> {polling.caveat}
      </p>
    </div>
  );
}
