"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, Calendar, Clock, Palette, Play, Square } from "lucide-react";
import type { FrancePreview } from "@/lib/schemas";

interface CountdownParts {
  days: string;
  hours: string;
  minutes: string;
}

function getCountdownParts(targetIso: string): CountdownParts {
  const diffMs = Math.max(0, new Date(targetIso).getTime() - Date.now());
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

export function FranceSpotlightCard({ data }: { data: FrancePreview }) {
  const [countdown, setCountdown] = useState<CountdownParts | null>(null);
  const [paletteMode, setPaletteMode] = useState<"neutral" | "override">("neutral");
  const [simulatingLive, setSimulatingLive] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdownParts(data.round1Iso));
    const initTimer = window.setTimeout(updateCountdown, 0);
    const interval = window.setInterval(updateCountdown, 30000);
    return () => {
      window.clearTimeout(initTimer);
      window.clearInterval(interval);
    };
  }, [data.round1Iso]);

  useEffect(() => {
    if (!simulatingLive) return;
    const timer = window.setInterval(() => {
      setTick((prev) => (prev + 1) % 12);
    }, 1500);
    return () => window.clearInterval(timer);
  }, [simulatingLive]);

  const reportingPct = simulatingLive
    ? Math.min(98.4, 74.2 + tick * 2.1).toFixed(1)
    : "74.2";

  const computedTracks = data.previewTracks.map((track, idx) => {
    const wave = simulatingLive ? Math.sin(tick * 0.9 + idx * 1.4) * 0.45 : 0;
    const share = Math.max(1.1, track.baseShare + wave);
    const votes = Math.round(track.baseVotes + (simulatingLive ? tick * (28000 - idx * 2400) : 0));
    return {
      ...track,
      share,
      votes,
    };
  });

  return (
    <div
      id="france-2027"
      className="rounded-2xl border border-border bg-surface p-5 shadow-xl shadow-black/15 sm:p-6"
    >
      {/* Top header strip */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/80 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-live-border bg-live-bg px-2.5 py-0.5 text-[11px] font-semibold text-live-text">
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full bg-live ${
                  simulatingLive ? "animate-live-dot" : ""
                }`}
              />
              {simulatingLive ? "LIVE SIMULATION ACTIVE" : "PHASE 1 FLAGSHIP RACE"}
            </span>
            <span className="rounded-md border border-border bg-bg px-2 py-0.5 font-mono text-[11px] text-muted">
              {data.plannedPath}
            </span>
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-text sm:text-2xl">
            {data.title}
          </h2>
          <p className="text-xs text-muted">
            {data.electoralSystem} &bull; {data.termLengthYears}-year mandate &bull;{" "}
            {data.pollCloseUtc}
          </p>
        </div>

        {/* Live countdown box */}
        <div className="rounded-xl border border-border bg-bg/90 px-3.5 py-2.5 text-right">
          <div className="flex items-center justify-end gap-1.5 text-[11px] font-medium text-muted">
            <Clock className="h-3 w-3 text-brand" aria-hidden="true" />
            <span>Round 1 Countdown</span>
          </div>
          <div className="font-display tabular-nums mt-0.5 text-lg font-bold tracking-tight text-text sm:text-xl">
            {countdown
              ? `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`
              : "---d --h --m"}
          </div>
        </div>
      </div>

      {/* Round timeline pills */}
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-bg/60 px-3.5 py-2.5">
          <Calendar className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          <div>
            <div className="text-[11px] font-medium text-muted">First Round Ballot</div>
            <div className="font-display text-sm font-semibold text-text">
              {data.round1Label}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-bg/60 px-3.5 py-2.5">
          <Calendar className="h-4 w-4 shrink-0 text-live" aria-hidden="true" />
          <div>
            <div className="text-[11px] font-medium text-muted">Runoff (if required)</div>
            <div className="font-display text-sm font-semibold text-text">
              {data.round2Label}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive controls for palette & tabular figures */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5">
        <div className="inline-flex rounded-lg border border-border bg-bg p-0.5">
          <button
            type="button"
            onClick={() => setPaletteMode("neutral")}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
              paletteMode === "neutral"
                ? "bg-brand text-brand-contrast"
                : "text-muted hover:text-text"
            }`}
          >
            <Palette className="h-3 w-3" aria-hidden="true" />
            <span>--d1 to --d8</span>
          </button>
          <button
            type="button"
            onClick={() => setPaletteMode("override")}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
              paletteMode === "override"
                ? "bg-brand text-brand-contrast"
                : "text-muted hover:text-text"
            }`}
          >
            <span>Party Override</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setSimulatingLive((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
            simulatingLive
              ? "border-live bg-live-bg text-live-text"
              : "border-border bg-bg text-text hover:border-brand/70"
          }`}
        >
          {simulatingLive ? (
            <>
              <Square className="h-3 w-3 fill-current" aria-hidden="true" />
              <span>Stop Live Feed Test</span>
            </>
          ) : (
            <>
              <Play className="h-3 w-3 fill-current text-live" aria-hidden="true" />
              <span>Simulate Live Count</span>
            </>
          )}
        </button>
      </div>

      {/* Telemetry bars demonstrating tabular-nums + chart variables */}
      <div className="mt-4 rounded-xl border border-border/80 bg-bg/70 p-4">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-muted">
            <Activity className="h-3.5 w-3.5 text-live" aria-hidden="true" />
            <span>Schema Preview Tally</span>
          </span>
          <span className="tabular-nums font-semibold text-text">
            {reportingPct}% precincts reporting
          </span>
        </div>

        {/* Stacked summary bar */}
        <div
          className="mb-4 flex h-3 w-full overflow-hidden rounded-full bg-surface-2"
          role="img"
          aria-label="Proportional distribution bar across eight preview tracks"
        >
          {computedTracks.map((track) => {
            const color =
              paletteMode === "neutral"
                ? `var(${track.tokenVar})`
                : track.partyOverrideColor;
            return (
              <div
                key={track.id}
                style={{
                  width: `${track.share}%`,
                  backgroundColor: color,
                }}
                className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                title={`${track.label}: ${track.share.toFixed(1)}%`}
              />
            );
          })}
        </div>

        {/* Individual rows */}
        <div className="space-y-2">
          {computedTracks.slice(0, 5).map((track) => {
            const color =
              paletteMode === "neutral"
                ? `var(${track.tokenVar})`
                : track.partyOverrideColor;
            return (
              <div key={track.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-medium text-text">{track.label}</span>
                    <span className="font-mono text-[10px] text-muted">
                      {paletteMode === "neutral" ? track.tokenVar : track.partyOverrideColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="tabular-nums text-[11px] text-muted">
                      {track.votes.toLocaleString("en-US")}
                    </span>
                    <span className="font-display tabular-nums w-12 text-right font-bold text-text">
                      {track.share.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, track.share * 2.4)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-2.5 text-[11px] leading-relaxed text-muted">
          <p className="max-w-sm">{data.previewNotice}</p>
          <Link
            href={data.countryHubPath}
            className="inline-flex shrink-0 items-center gap-1 font-semibold text-brand hover:underline"
          >
            <span>Open {data.countryHubPath}</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
