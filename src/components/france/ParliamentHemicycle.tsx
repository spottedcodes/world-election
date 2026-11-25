"use client";

import { useMemo, useState } from "react";
import type { ParliamentGroup } from "@/lib/schemas";

interface SeatPoint {
  x: number;
  y: number;
  groupCode: string;
  groupName: string;
  color: string;
}

function generateHemicycleSeats(
  groups: ParliamentGroup[],
  totalSeats: number,
  rowCount: number
): SeatPoint[] {
  const cx = 220;
  const cy = 205;
  const minR = 82;
  const maxR = 188;
  const stepR = (maxR - minR) / Math.max(1, rowCount - 1);

  const radii = Array.from({ length: rowCount }, (_, i) => minR + i * stepR);
  const sumRadii = radii.reduce((acc, r) => acc + r, 0);

  // Distribute seat counts per concentric arc proportionally to radius
  const counts = radii.map((r) => Math.floor((r / sumRadii) * totalSeats));
  let assigned = counts.reduce((a, b) => a + b, 0);
  let rIdx = rowCount - 1;
  while (assigned < totalSeats) {
    counts[rIdx] += 1;
    assigned += 1;
    rIdx = (rIdx - 1 + rowCount) % rowCount;
  }

  // Generate candidate coordinates with angle sorted left-to-right (PI -> 0)
  const rawSlots: { x: number; y: number; angle: number; r: number }[] = [];
  radii.forEach((radius, idx) => {
    const count = counts[idx];
    for (let j = 0; j < count; j++) {
      const frac = count === 1 ? 0.5 : j / (count - 1);
      const angle = Math.PI - frac * Math.PI;
      rawSlots.push({
        x: cx + radius * Math.cos(angle),
        y: cy - radius * Math.sin(angle),
        angle,
        r: radius,
      });
    }
  });

  // Sort strictly from left (PI) to right (0), inner-to-outer as tie-breaker
  rawSlots.sort((a, b) => b.angle - a.angle || a.r - b.r);

  const seatSequence: { code: string; name: string; color: string }[] = [];
  for (const g of groups) {
    for (let s = 0; s < g.seats; s++) {
      seatSequence.push({ code: g.code, name: g.name, color: g.color });
    }
  }

  return rawSlots.slice(0, seatSequence.length).map((slot, idx) => ({
    x: Number(slot.x.toFixed(1)),
    y: Number(slot.y.toFixed(1)),
    groupCode: seatSequence[idx].code,
    groupName: seatSequence[idx].name,
    color: seatSequence[idx].color,
  }));
}

export function ParliamentHemicycle({
  chamberName,
  totalSeats,
  majorityThreshold,
  groups,
  rows = 9,
  subtitle,
  highlightNote,
}: {
  chamberName: string;
  totalSeats: number;
  majorityThreshold: number;
  groups: ParliamentGroup[];
  rows?: number;
  subtitle: string;
  highlightNote: string;
}) {
  const [activeCode, setActiveCode] = useState<string | null>(null);

  const seats = useMemo(
    () => generateHemicycleSeats(groups, totalSeats, rows),
    [groups, totalSeats, rows]
  );

  const activeGroup = activeCode
    ? groups.find((g) => g.code === activeCode) ?? null
    : null;

  const dotRadius = totalSeats > 450 ? 3.8 : 4.7;

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/80 pb-4">
        <div>
          <h3 className="font-display text-lg font-bold text-text sm:text-xl">
            {chamberName}
          </h3>
          <p className="mt-1 text-xs text-muted">{subtitle}</p>
        </div>
        <div className="rounded-xl border border-border bg-bg/80 px-3 py-1.5 text-right">
          <div className="text-[10px] font-medium text-muted uppercase">
            Majority
          </div>
          <div className="font-display tabular-nums text-sm font-bold text-text">
            {majorityThreshold} / {totalSeats}
          </div>
        </div>
      </div>

      {/* SVG Hemicycle */}
      <div className="relative mt-4">
        <svg
          viewBox="0 0 440 225"
          className="mx-auto w-full max-w-[440px]"
          role="img"
          aria-label={`${chamberName} hemicycle seating chart (${totalSeats} seats)`}
        >
          {/* Majority center guideline */}
          <line
            x1="220"
            y1="10"
            x2="220"
            y2="132"
            stroke="var(--border)"
            strokeDasharray="3 3"
            strokeWidth="1.25"
          />

          {seats.map((seat, idx) => {
            const dimmed = activeCode !== null && seat.groupCode !== activeCode;
            return (
              <circle
                key={idx}
                cx={seat.x}
                cy={seat.y}
                r={dotRadius}
                fill={seat.color}
                opacity={dimmed ? 0.2 : 0.95}
                className="transition-opacity duration-150 cursor-pointer"
                onMouseEnter={() => setActiveCode(seat.groupCode)}
                onMouseLeave={() => setActiveCode(null)}
                onClick={() =>
                  setActiveCode((prev) =>
                    prev === seat.groupCode ? null : seat.groupCode
                  )
                }
              >
                <title>{`${seat.groupCode} — ${seat.groupName}`}</title>
              </circle>
            );
          })}

          {/* Center readout inside hemicycle */}
          <text
            x="220"
            y="182"
            textAnchor="middle"
            className="font-display tabular-nums"
            fill="var(--text)"
            fontSize="24"
            fontWeight="700"
          >
            {activeGroup ? activeGroup.seats : totalSeats}
          </text>
          <text
            x="220"
            y="202"
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="11"
            fontWeight="500"
          >
            {activeGroup
              ? `${activeGroup.code} (${((activeGroup.seats / totalSeats) * 100).toFixed(1)}%)`
              : "Total seats"}
          </text>
        </svg>
      </div>

      {/* Interactive legend */}
      <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {groups.map((group) => {
          const isSelected = activeCode === group.code;
          return (
            <button
              key={group.code}
              type="button"
              onMouseEnter={() => setActiveCode(group.code)}
              onMouseLeave={() => setActiveCode(null)}
              onClick={() =>
                setActiveCode((prev) =>
                  prev === group.code ? null : group.code
                )
              }
              className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                isSelected
                  ? "border-brand bg-surface-2"
                  : "border-border/70 bg-bg/60 hover:border-border"
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <span className="font-mono text-[11px] font-semibold text-text">
                  {group.code}
                </span>
                <span className="truncate text-[11px] text-muted">
                  {group.name}
                </span>
              </span>
              <span className="font-display tabular-nums shrink-0 font-bold text-text">
                {group.seats}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 rounded-xl border border-border/80 bg-bg/65 p-3 text-xs leading-relaxed text-muted">
        {highlightNote}
      </p>
    </div>
  );
}
