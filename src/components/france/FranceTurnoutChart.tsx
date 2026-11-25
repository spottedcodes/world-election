"use client";

import { useState } from "react";
import type { FranceHubData } from "@/lib/schemas";

export function FranceTurnoutChart({
  trends,
}: {
  trends: FranceHubData["turnoutTrends"];
}) {
  const [round, setRound] = useState<"r1" | "r2">("r1");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const W = 640;
  const H = 260;
  const PAD_L = 44;
  const PAD_R = 24;
  const PAD_T = 22;
  const PAD_B = 34;

  const minYear = 1995;
  const maxYear = 2024;
  const minPct = 35;
  const maxPct = 90;

  const xFor = (year: number) =>
    PAD_L + ((year - minYear) / (maxYear - minYear)) * (W - PAD_L - PAD_R);
  const yFor = (pct: number) =>
    H - PAD_B - ((pct - minPct) / (maxPct - minPct)) * (H - PAD_T - PAD_B);

  const presPoints = trends.presidential.map((p) => ({
    year: p.year,
    pct: p[round],
    x: xFor(p.year),
    y: yFor(p[round]),
  }));

  const legPoints = trends.legislative.map((p) => ({
    year: p.year,
    pct: p[round],
    x: xFor(p.year),
    y: yFor(p[round]),
  }));

  const toPolyline = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const allYears = Array.from(
    new Set([
      ...trends.presidential.map((p) => p.year),
      ...trends.legislative.map((p) => p.year),
    ])
  ).sort((a, b) => a - b);

  const activePres = selectedYear
    ? trends.presidential.find((p) => p.year === selectedYear)
    : null;
  const activeLeg = selectedYear
    ? trends.legislative.find((p) => p.year === selectedYear)
    : null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div>
          <h3 className="font-display text-lg font-bold text-text sm:text-xl">
            Presidential vs. Legislative Turnout (1995–2024)
          </h3>
          <p className="mt-1 text-xs text-muted">
            Share of registered voters casting ballots; note the 2024 snap legislative surge to{" "}
            <span className="tabular-nums font-semibold text-text">66.7%</span>.
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-border bg-bg p-0.5">
          <button
            type="button"
            onClick={() => setRound("r1")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              round === "r1"
                ? "bg-brand text-brand-contrast"
                : "text-muted hover:text-text"
            }`}
          >
            First Round
          </button>
          <button
            type="button"
            onClick={() => setRound("r2")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
              round === "r2"
                ? "bg-brand text-brand-contrast"
                : "text-muted hover:text-text"
            }`}
          >
            Second Round
          </button>
        </div>
      </div>

      {/* Legend & selected readout */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 font-medium text-text">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "var(--d1)" }}
            />
            Presidential ({round === "r1" ? "R1" : "R2"})
          </span>
          <span className="inline-flex items-center gap-2 font-medium text-text">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "var(--d2)" }}
            />
            Legislative ({round === "r1" ? "R1" : "R2"})
          </span>
        </div>

        <div className="tabular-nums text-muted">
          {selectedYear ? (
            <span>
              <strong className="text-text">{selectedYear}:</strong>{" "}
              {activePres ? `Pres. ${activePres[round].toFixed(1)}%` : ""}
              {activePres && activeLeg ? " • " : ""}
              {activeLeg ? `Leg. ${activeLeg[round].toFixed(1)}%` : ""}
            </span>
          ) : (
            <span>Hover or tap any point to inspect exact turnout</span>
          )}
        </div>
      </div>

      <div className="mt-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Line chart of French presidential and legislative voter turnout from 1995 to 2024"
        >
          {/* Horizontal gridlines */}
          {[40, 50, 60, 70, 80, 90].map((pct) => {
            const y = yFor(pct);
            return (
              <g key={pct}>
                <line
                  x1={PAD_L}
                  y1={y}
                  x2={W - PAD_R}
                  y2={y}
                  stroke="var(--border)"
                  strokeOpacity="0.65"
                  strokeDasharray="3 4"
                />
                <text
                  x={PAD_L - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--text-muted)"
                  fontSize="10"
                  className="tabular-nums"
                >
                  {pct}%
                </text>
              </g>
            );
          })}

          {/* X-axis year ticks */}
          {allYears.map((yr) => {
            const x = xFor(yr);
            return (
              <text
                key={yr}
                x={x}
                y={H - 10}
                textAnchor="middle"
                fill={selectedYear === yr ? "var(--text)" : "var(--text-muted)"}
                fontWeight={selectedYear === yr ? "700" : "500"}
                fontSize="10"
                className="tabular-nums"
              >
                {yr}
              </text>
            );
          })}

          {/* Lines */}
          <polyline
            fill="none"
            stroke="var(--d1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={toPolyline(presPoints)}
          />
          <polyline
            fill="none"
            stroke="var(--d2)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={toPolyline(legPoints)}
          />

          {/* Interactive points */}
          {presPoints.map((pt) => (
            <g
              key={`pres-${pt.year}`}
              onMouseEnter={() => setSelectedYear(pt.year)}
              onClick={() => setSelectedYear(pt.year)}
              className="cursor-pointer"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={selectedYear === pt.year ? 6 : 4.2}
                fill="var(--d1)"
                stroke="var(--surface)"
                strokeWidth="1.5"
              />
              <text
                x={pt.x}
                y={pt.y - 9}
                textAnchor="middle"
                fill="var(--text)"
                fontSize="9.5"
                fontWeight="600"
                className="tabular-nums"
              >
                {pt.pct.toFixed(1)}%
              </text>
            </g>
          ))}

          {legPoints.map((pt) => (
            <g
              key={`leg-${pt.year}`}
              onMouseEnter={() => setSelectedYear(pt.year)}
              onClick={() => setSelectedYear(pt.year)}
              className="cursor-pointer"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={selectedYear === pt.year ? 6 : 4.2}
                fill="var(--d2)"
                stroke="var(--surface)"
                strokeWidth="1.5"
              />
              <text
                x={pt.x}
                y={pt.y + 15}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="9.5"
                fontWeight="600"
                className="tabular-nums"
              >
                {pt.pct.toFixed(1)}%
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
