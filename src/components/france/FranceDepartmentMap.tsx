"use client";

import { useMemo, useState } from "react";
import { Globe, MapPin } from "lucide-react";
import type {
  DepartmentRoundEntry,
  FranceDepartmentGeo,
  FranceDepartmentResults,
} from "@/lib/schemas";

type ElectionKey = "2022-r2" | "2022-r1" | "2017-r2" | "2017-r1";

const ROUND_LABELS: Record<ElectionKey, string> = {
  "2022-r2": "2022 Runoff (R2)",
  "2022-r1": "2022 First Round (R1)",
  "2017-r2": "2017 Runoff (R2)",
  "2017-r1": "2017 First Round (R1)",
};

export function FranceDepartmentMap({
  geo,
  results,
}: {
  geo: FranceDepartmentGeo;
  results: FranceDepartmentResults;
}) {
  const [electionKey, setElectionKey] = useState<ElectionKey>("2022-r2");
  const [selectedCode, setSelectedCode] = useState<string>("75");

  const roundMap = results[electionKey];
  const selectedEntry: DepartmentRoundEntry | undefined =
    roundMap[selectedCode] ?? roundMap["75"];

  // Compute leader summary across all 101 departments + abroad for the legend
  const leaderSummary = useMemo(() => {
    const counts = new Map<
      string,
      { name: string; color: string; count: number }
    >();
    Object.values(roundMap).forEach((dep) => {
      const existing = counts.get(dep.winnerId);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(dep.winnerId, {
          name: dep.winnerName,
          color: dep.winnerColor,
          count: 1,
        });
      }
    });
    return Array.from(counts.values()).sort((a, b) => b.count - a.count);
  }, [roundMap]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-border/80 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-brand uppercase">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Official Ministry of the Interior Data</span>
          </div>
          <h3 className="font-display mt-1 text-lg font-bold text-text sm:text-xl">
            Presidential Results by Department
          </h3>
          <p className="mt-1 text-xs text-muted">
            96 metropolitan departments, Paris &amp; Petite Couronne zoom inset, 5 Overseas
            departments, and French citizens abroad. Click any territory to inspect.
          </p>
        </div>

        {/* Election year & round toggle */}
        <div
          role="tablist"
          aria-label="Select presidential election year and round"
          className="flex flex-wrap gap-1 rounded-xl border border-border bg-bg p-1"
        >
          {(Object.keys(ROUND_LABELS) as ElectionKey[]).map((key) => {
            const active = electionKey === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setElectionKey(key)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? "bg-brand text-brand-contrast"
                    : "text-muted hover:text-text"
                }`}
              >
                {ROUND_LABELS[key]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {leaderSummary.map((item) => (
          <div
            key={item.name}
            className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-bg/70 px-2.5 py-1 text-xs"
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-sm border border-black/15"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-medium text-text">{item.name}</span>
            <span className="tabular-nums font-semibold text-muted">
              {item.count}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid items-start gap-6 lg:grid-cols-12">
        {/* Map + Insets column */}
        <div className="space-y-4 lg:col-span-7">
          <div className="relative rounded-2xl border border-border/80 bg-bg/70 p-3">
            <svg
              viewBox={geo.viewBox}
              className="w-full"
              role="img"
              aria-label={`French department election map for ${ROUND_LABELS[electionKey]}`}
            >
              {geo.metropolitan.map((dep) => {
                const entry = roundMap[dep.code];
                const isSelected = selectedCode === dep.code;
                const fillColor = entry?.winnerColor ?? "var(--surface-2)";
                return (
                  <path
                    key={dep.code}
                    d={dep.d}
                    fill={fillColor}
                    fillOpacity={isSelected ? 1 : 0.84}
                    stroke={isSelected ? "var(--text)" : "var(--bg)"}
                    strokeWidth={isSelected ? 2 : 0.85}
                    className="transition-opacity duration-100 hover:opacity-100 cursor-pointer"
                    onMouseEnter={() => setSelectedCode(dep.code)}
                    onClick={() => setSelectedCode(dep.code)}
                  >
                    <title>
                      {`${dep.code} ${dep.name}: ${
                        entry
                          ? `${entry.winnerName} (${entry.winnerShare.toFixed(1)}%)`
                          : "N/A"
                      }`}
                    </title>
                  </path>
                );
              })}
            </svg>

            {/* Paris / Petite Couronne Zoom Inset */}
            <div className="mt-3 rounded-xl border border-border bg-surface/95 p-2.5 sm:absolute sm:top-3 sm:left-3 sm:mt-0 sm:w-36">
              <div className="mb-1 text-[10px] font-semibold text-muted uppercase">
                Paris &amp; Petite Couronne
              </div>
              <svg
                viewBox={geo.petiteCouronneViewBox}
                className="mx-auto h-24 w-24"
                aria-label="Zoomed inset for Paris (75), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94)"
              >
                {geo.petiteCouronne.map((dep) => {
                  const entry = roundMap[dep.code];
                  const isSelected = selectedCode === dep.code;
                  return (
                    <path
                      key={`pc-${dep.code}`}
                      d={dep.d}
                      fill={entry?.winnerColor ?? "var(--surface-2)"}
                      fillOpacity={isSelected ? 1 : 0.88}
                      stroke={isSelected ? "var(--text)" : "var(--bg)"}
                      strokeWidth={isSelected ? 2.2 : 1}
                      className="cursor-pointer"
                      onMouseEnter={() => setSelectedCode(dep.code)}
                      onClick={() => setSelectedCode(dep.code)}
                    >
                      <title>
                        {`${dep.code} ${dep.name}: ${
                          entry
                            ? `${entry.winnerName} (${entry.winnerShare.toFixed(1)}%)`
                            : "N/A"
                        }`}
                      </title>
                    </path>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* 5 Overseas Departments + Citizens Abroad Inset Tiles */}
          <div>
            <div className="mb-2 text-[11px] font-semibold tracking-wide text-muted uppercase">
              Overseas Departments (DOM) &amp; Citizens Abroad
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {geo.overseas.map((dom) => {
                const entry = roundMap[dom.code];
                const isSelected = selectedCode === dom.code;
                return (
                  <button
                    key={dom.code}
                    type="button"
                    onClick={() => setSelectedCode(dom.code)}
                    onMouseEnter={() => setSelectedCode(dom.code)}
                    className={`flex flex-col items-center rounded-xl border p-2 text-center transition-colors cursor-pointer ${
                      isSelected
                        ? "border-brand bg-surface-2"
                        : "border-border/80 bg-bg/65 hover:border-brand/60"
                    }`}
                  >
                    <svg
                      viewBox={geo.overseasViewBox}
                      className="h-11 w-11"
                      aria-hidden="true"
                    >
                      <path
                        d={dom.d}
                        fill={entry?.winnerColor ?? "var(--surface-2)"}
                        stroke="var(--bg)"
                        strokeWidth="1"
                      />
                    </svg>
                    <span className="mt-1 truncate text-[10px] font-semibold text-text">
                      {dom.code} {dom.name.replace("La ", "")}
                    </span>
                  </button>
                );
              })}

              {/* French citizens abroad (ZZ) */}
              {roundMap["ZZ"] && (
                <button
                  type="button"
                  onClick={() => setSelectedCode("ZZ")}
                  onMouseEnter={() => setSelectedCode("ZZ")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2 text-center transition-colors cursor-pointer ${
                    selectedCode === "ZZ"
                      ? "border-brand bg-surface-2"
                      : "border-border/80 bg-bg/65 hover:border-brand/60"
                  }`}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15"
                    style={{ backgroundColor: roundMap["ZZ"].winnerColor }}
                  >
                    <Globe className="h-5 w-5 text-[#12112a]" aria-hidden="true" />
                  </span>
                  <span className="mt-1 truncate text-[10px] font-semibold text-text">
                    ZZ Abroad
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Selected department breakdown panel */}
        <div className="rounded-2xl border border-border bg-bg/75 p-5 lg:col-span-5">
          {selectedEntry ? (
            <>
              <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-3.5">
                <div>
                  <div className="font-mono text-xs font-semibold text-brand">
                    Code {selectedEntry.code} &bull; {ROUND_LABELS[electionKey]}
                  </div>
                  <h4 className="font-display mt-0.5 text-xl font-bold text-text">
                    {selectedEntry.name}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-muted">Turnout</div>
                  <div className="font-display tabular-nums text-lg font-bold text-text">
                    {selectedEntry.turnout.toFixed(2)}%
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-border/80 bg-surface px-3.5 py-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 rounded-sm border border-black/15"
                    style={{ backgroundColor: selectedEntry.winnerColor }}
                  />
                  <span className="font-semibold text-text">
                    {selectedEntry.winnerName}
                  </span>
                </div>
                <span className="tabular-nums text-muted">
                  Lead +{selectedEntry.margin.toFixed(2)} pts
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {selectedEntry.topCandidates.map((cand) => (
                  <div key={cand.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 shrink-0 rounded-sm border border-black/15"
                          style={{ backgroundColor: cand.color }}
                        />
                        <span className="truncate font-medium text-text">
                          {cand.name}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2.5">
                        <span className="tabular-nums text-[11px] text-muted">
                          {cand.votes.toLocaleString("en-US")}
                        </span>
                        <span className="font-display tabular-nums w-14 text-right font-bold text-text">
                          {cand.share.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, cand.share)}%`,
                          backgroundColor: cand.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted">
                <span>Valid ballots cast</span>
                <span className="tabular-nums font-semibold text-text">
                  {selectedEntry.validVotes.toLocaleString("en-US")}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted">
              Select any department on the map to inspect results.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
