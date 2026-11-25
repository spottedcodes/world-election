import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  ExternalLink,
  History,
  Landmark,
  Layers,
  ShieldCheck,
  Users,
} from "lucide-react";
import { FaqAccordion } from "@/components/FaqAccordion";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { FranceDepartmentMap } from "@/components/france/FranceDepartmentMap";
import { FranceNextElectionCard } from "@/components/france/FranceNextElectionCard";
import { FrancePollingSnapshot } from "@/components/france/FrancePollingSnapshot";
import { FranceTurnoutChart } from "@/components/france/FranceTurnoutChart";
import { ParliamentHemicycle } from "@/components/france/ParliamentHemicycle";
import { getFranceHubContent } from "@/lib/content";
import {
  getFranceDepartmentGeo,
  getFranceDepartmentResults,
  getFranceHubData,
} from "@/lib/data";

export function generateMetadata(): Metadata {
  const { frontmatter } = getFranceHubContent();
  return {
    title: frontmatter.metaTitle,
    description: frontmatter.metaDescription,
  };
}

const UPCOMING_BADGES = {
  confirmed: {
    label: "Confirmed",
    classes: "border-live-border bg-live-bg text-live-text",
  },
  scheduled: {
    label: "Scheduled Cycle",
    classes: "border-brand/40 bg-brand/10 text-brand",
  },
  unconfirmed: {
    label: "No Date Confirmed",
    classes: "border-border bg-surface-2 text-muted",
  },
} as const;

export default function FranceHubPage() {
  const data = getFranceHubData();
  const geo = getFranceDepartmentGeo();
  const depResults = getFranceDepartmentResults();
  const { frontmatter, blocks } = getFranceHubContent();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: frontmatter.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Top Country Hero + Next Election + Quick Facts */}
      <section className="telemetry-grid relative overflow-hidden border-b border-border/80">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-36 left-1/2 h-[380px] w-[720px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--glow) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          {/* Breadcrumb & country header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/90 px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:border-brand/70"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              <span>Global Overview</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono font-semibold text-text">
                {data.countryCode}
              </span>
              <span>{data.officialName}</span>
              <span aria-hidden="true">&bull;</span>
              <span className="tabular-nums">Updated {data.lastUpdated}</span>
            </div>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-12">
            {/* Left: Country intro + Next election card */}
            <div className="min-w-0 space-y-6 lg:col-span-7">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3.5 py-1 text-xs font-medium text-brand">
                  <span>{frontmatter.heroEyebrow}</span>
                </div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-text sm:text-5xl">
                  {frontmatter.heroTitle}
                </h1>
                <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                  {frontmatter.heroSubtitle}
                </p>
              </div>

              <FranceNextElectionCard nextElection={data.nextElection} />
            </div>

            {/* Right: Quick Facts Box */}
            <aside
              aria-label="France Electoral Quick Facts"
              className="min-w-0 rounded-2xl border border-border bg-surface p-5 shadow-lg shadow-black/10 lg:col-span-5 sm:p-6"
            >
              <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
                <div className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-brand" aria-hidden="true" />
                  <h2 className="font-display text-lg font-bold text-text">
                    Quick Facts
                  </h2>
                </div>
                <span className="rounded-md border border-border bg-bg px-2 py-0.5 font-mono text-[10px] font-semibold text-muted">
                  Fifth Republic
                </span>
              </div>

              <dl className="mt-4 divide-y divide-border/70">
                {data.quickFacts.map((fact) => (
                  <div key={fact.label} className="py-3 first:pt-0 last:pb-0">
                    <dt className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                      {fact.label}
                    </dt>
                    <dd className="font-display mt-0.5 text-sm font-bold text-text sm:text-[15px]">
                      {fact.value}
                    </dd>
                    <dd className="mt-0.5 text-xs text-muted">{fact.note}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:space-y-16 sm:px-6 sm:py-14">
        {/* Section 3: Upcoming Elections */}
        <section id="upcoming" className="scroll-mt-24 space-y-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-brand uppercase">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>National &amp; European Schedule</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
              Upcoming French Elections
            </h2>
          </div>

          <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
            {data.upcomingElections.map((item) => {
              const badge = UPCOMING_BADGES[item.status];
              return (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-muted">
                        {item.body}
                      </span>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${badge.classes}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <h3 className="font-display mt-2 text-lg font-bold text-text">
                      {item.title}
                    </h3>
                    <div className="font-display tabular-nums mt-2 text-sm font-semibold text-brand">
                      {item.dateLabel}
                    </div>
                  </div>
                  <p className="mt-3 border-t border-border/70 pt-3 text-xs leading-relaxed text-muted">
                    {item.notes}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Section 4: Department Choropleth Map */}
        <section id="map" className="scroll-mt-24">
          <FranceDepartmentMap geo={geo} results={depResults} />
        </section>

        {/* Section 5 & 6: National Assembly & Senate Hemicycles */}
        <section id="parliament" className="scroll-mt-24 space-y-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-brand uppercase">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Bicameral Legislature</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
              Parliament Composition: National Assembly &amp; Senate
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* National Assembly */}
            <div className="min-w-0 space-y-4">
              <ParliamentHemicycle
                chamberName={data.nationalAssembly.chamberName}
                totalSeats={data.nationalAssembly.totalSeats}
                majorityThreshold={data.nationalAssembly.majorityThreshold}
                groups={data.nationalAssembly.groups}
                rows={10}
                subtitle={`Last election: ${data.nationalAssembly.lastElectionDates} (${data.nationalAssembly.lastElectionTurnout})`}
                highlightNote={data.nationalAssembly.seatChangesNote}
              />

              {/* July 2024 Election Baseline Strip */}
              <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-2.5">
                  <span className="font-display text-sm font-bold text-text">
                    July 7, 2024 Election Baseline (By Coalition)
                  </span>
                  <span className="text-[11px] text-muted">
                    Seat changes occurred after group formation
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {data.nationalAssembly.july2024Blocs.map((b) => (
                    <div
                      key={b.bloc}
                      className="rounded-xl border border-border/80 bg-bg/70 p-2.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: b.color }}
                        />
                        <span className="truncate text-[10px] font-medium text-muted">
                          {b.bloc}
                        </span>
                      </div>
                      <div className="font-display tabular-nums mt-1 text-sm font-bold text-text">
                        {b.approxSeats}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Senate */}
            <div className="min-w-0 space-y-4">
              <ParliamentHemicycle
                chamberName={data.senate.chamberName}
                totalSeats={data.senate.totalSeats}
                majorityThreshold={data.senate.majorityThreshold}
                groups={data.senate.groups}
                rows={8}
                subtitle={`Last renewal: ${data.senate.lastRenewalDate} • ${data.senate.seatsRenewed} seats renewed`}
                highlightNote={`${data.senate.electoralCollegeNote} ${data.senate.renewalHighlight}`}
              />
            </div>
          </div>
        </section>

        {/* Section 7 & 8: Polling Snapshot + Turnout Trends */}
        <section id="trends" className="scroll-mt-24 space-y-5">
          <div className="grid gap-6 xl:grid-cols-12">
            <div className="min-w-0 xl:col-span-5">
              <FrancePollingSnapshot
                polling={data.pollingSnapshot}
                previewHref={data.nextElection.previewHref}
              />
            </div>
            <div className="min-w-0 xl:col-span-7">
              <FranceTurnoutChart trends={data.turnoutTrends} />
            </div>
          </div>
        </section>

        {/* Section 9: Presidential Elections History Table */}
        <section id="history" className="scroll-mt-24 space-y-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-brand uppercase">
              <History className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Fifth Republic Direct Ballots (1965–2022)</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
              Presidential Elections History
            </h2>
            <p className="text-sm text-muted">
              All eleven direct presidential elections under the Fifth Republic.
              Individual archive pages unlock in Phase 2.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-bg/70 text-[11px] font-semibold tracking-wide text-muted uppercase">
                  <th className="px-4 py-3.5">Year</th>
                  <th className="px-4 py-3.5">Winner</th>
                  <th className="px-4 py-3.5">Runoff Opponent</th>
                  <th className="px-4 py-3.5 text-right">Round 1 (W / Opp)</th>
                  <th className="px-4 py-3.5 text-right">Round 2 (W / Opp)</th>
                  <th className="px-4 py-3.5 text-right">Turnout (R1 / R2)</th>
                  <th className="px-4 py-3.5 text-right">Archive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {data.presidentialHistory.map((row) => (
                  <tr
                    key={row.year}
                    className="transition-colors hover:bg-surface-2/40"
                  >
                    <td className="font-display tabular-nums px-4 py-3 font-bold text-text">
                      {row.year}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-text">{row.winner}</div>
                      <div className="text-xs text-muted">{row.winnerParty}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-text">{row.opponent}</div>
                      <div className="text-xs text-muted">{row.opponentParty}</div>
                    </td>
                    <td className="tabular-nums px-4 py-3 text-right text-xs text-muted">
                      <span className="font-semibold text-text">
                        {row.winnerR1.toFixed(1)}%
                      </span>{" "}
                      / {row.opponentR1.toFixed(1)}%
                    </td>
                    <td className="tabular-nums px-4 py-3 text-right text-xs">
                      <span className="font-display font-bold text-brand">
                        {row.winnerR2.toFixed(2).replace(/\.00$/, ".0")}%
                      </span>{" "}
                      <span className="text-muted">
                        / {row.opponentR2.toFixed(2).replace(/\.00$/, ".0")}%
                      </span>
                    </td>
                    <td className="tabular-nums px-4 py-3 text-right text-xs text-muted">
                      {row.turnoutR1.toFixed(1)}% / {row.turnoutR2.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        title={`Planned archive: ${row.plannedRoute}`}
                        className="inline-flex rounded-md border border-border bg-bg px-2 py-0.5 font-mono text-[10px] text-muted"
                      >
                        Planned
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 10: Parties & Political Groups Grid */}
        <section id="parties" className="scroll-mt-24 space-y-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-brand uppercase">
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Political Landscape</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
              Major Parties &amp; Parliamentary Blocs
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.parties.map((party) => (
              <article
                key={party.code}
                className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Crisp SVG emblem badge */}
                      <span
                        className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/20 text-xs font-bold text-[#12112a] shadow-sm"
                        style={{ backgroundColor: party.color }}
                      >
                        {party.code}
                      </span>
                      <div>
                        <h3 className="font-display text-base font-bold text-text">
                          {party.name}
                        </h3>
                        <p className="text-xs text-muted">{party.ideology}</p>
                      </div>
                    </div>
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg border border-border/70 bg-bg/70 px-2.5 py-2">
                      <dt className="text-[10px] text-muted uppercase">
                        Assembly
                      </dt>
                      <dd className="tabular-nums mt-0.5 font-semibold text-text">
                        {party.assemblySeats}
                      </dd>
                    </div>
                    <div className="rounded-lg border border-border/70 bg-bg/70 px-2.5 py-2">
                      <dt className="text-[10px] text-muted uppercase">
                        Senate
                      </dt>
                      <dd className="tabular-nums mt-0.5 font-semibold text-text">
                        {party.senateSeats}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    {party.recentResult}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-[11px] text-muted">
                  <span>Party profile page</span>
                  <span className="rounded border border-border bg-bg px-2 py-0.5 font-mono text-[10px]">
                    Planned
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section 11: Other Election Types */}
        <section id="other-elections" className="scroll-mt-24 space-y-5">
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
              European, Subnational &amp; Referendum Ballots
            </h2>
            <p className="text-sm text-muted">
              Verified results and schedules across France&apos;s non-parliamentary
              election cycles.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {data.otherElectionTypes.map((card) => (
              <article
                key={card.id}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-text">
                    {card.title}
                  </h3>
                  <span className="rounded-full border border-border bg-bg px-2.5 py-0.5 text-[11px] font-medium text-brand">
                    {card.nextCycle}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
                  <span>
                    Last held:{" "}
                    <strong className="text-text">{card.lastHeld}</strong>
                  </span>
                  <span>&bull;</span>
                  <span className="tabular-nums">
                    Turnout:{" "}
                    <strong className="text-text">{card.turnout}</strong>
                  </span>
                  <span>&bull;</span>
                  <span>{card.seats}</span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {card.summary}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Section 12 & 13: Electoral System Explainer + FAQ */}
        <section id="explainer" className="scroll-mt-24 border-t border-border/80 pt-14">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="min-w-0 rounded-2xl border border-border bg-surface p-6 lg:col-span-6">
              <div className="text-xs font-semibold tracking-wider text-brand uppercase">
                How France Votes
              </div>
              <div className="mt-2">
                <MarkdownRenderer blocks={blocks} />
              </div>
            </div>

            <div className="min-w-0 space-y-4 lg:col-span-6">
              <div className="space-y-1">
                <div className="text-xs font-semibold tracking-wider text-brand uppercase">
                  Frequently Asked Questions
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-text">
                  France Electoral FAQ
                </h2>
              </div>
              <FaqAccordion faqs={frontmatter.faqs} />
            </div>
          </div>
        </section>

        {/* Section 14: Data Sources & Last-Updated Trust Bar */}
        <section
          aria-label="Official Data Sources"
          className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand" aria-hidden="true" />
              <h2 className="font-display text-base font-bold text-text sm:text-lg">
                Official Sources &amp; Verification
              </h2>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1 text-xs font-medium text-muted">
              <CheckCircle2 className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              <span className="tabular-nums">Last updated: {data.lastUpdated}</span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {data.dataSources.map((src) => (
              <a
                key={src.name}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-border/80 bg-bg/70 p-3 text-xs transition-colors hover:border-brand/70"
              >
                <div className="flex items-center justify-between gap-1.5 font-semibold text-text group-hover:text-brand">
                  <span className="truncate">{src.name}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                </div>
                <p className="mt-1 leading-snug text-muted">{src.role}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
