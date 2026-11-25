import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, FileText, Radio, ShieldCheck } from "lucide-react";
import { FaqAccordion } from "@/components/FaqAccordion";
import { FranceSpotlightCard } from "@/components/FranceSpotlightCard";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { WatchlistSection } from "@/components/WatchlistSection";
import { getHomeOverviewContent } from "@/lib/content";
import {
  get2027Watchlist,
  getFrance2027Preview,
  getSiteConfig,
} from "@/lib/data";

export function generateMetadata(): Metadata {
  const { frontmatter } = getHomeOverviewContent();
  return {
    title: frontmatter.metaTitle,
    description: frontmatter.metaDescription,
  };
}

const ARCHITECTURE_PILLARS = [
  {
    icon: ShieldCheck,
    title: "SSG for Hubs & Archives",
    badge: "Static Shell",
    description:
      "Country hubs, electoral system guides, and certified past results prerender cleanly into fast CDN-ready HTML.",
  },
  {
    icon: Radio,
    title: "ISR + Live Election Telemetry",
    badge: "Live Night",
    description:
      "Active race pages use incremental revalidation paired with client-side JSON updates and tabular-numeral stability.",
  },
  {
    icon: Database,
    title: "Structured JSON Datasets",
    badge: "data/*.json",
    description:
      "Ballot dates, seat formulas, turnout, candidate totals, and party hex overrides live in Zod-validated JSON files.",
  },
  {
    icon: FileText,
    title: "Markdown Editorial Layer",
    badge: "content/*.md",
    description:
      "Meta titles, descriptions, FAQs, explainers, and legal documents live in clean Markdown with YAML frontmatter.",
  },
] as const;

export default function HomePage() {
  const siteConfig = getSiteConfig();
  const watchlist = get2027Watchlist();
  const francePreview = getFrance2027Preview();
  const overview = getHomeOverviewContent();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: overview.frontmatter.faqs.map((faq) => ({
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

      {/* Hero Section */}
      <section className="telemetry-grid relative overflow-hidden border-b border-border/80">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--glow) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-10">
            {/* Left narrative column */}
            <div className="space-y-6 lg:col-span-6 lg:pt-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/90 px-3.5 py-1.5 text-xs font-medium text-text">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-brand"
                />
                <span>{overview.frontmatter.heroEyebrow}</span>
              </div>

              <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-tight text-text sm:text-5xl">
                {overview.frontmatter.heroTitle}
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {overview.frontmatter.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="#watchlist"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-contrast shadow-sm transition-colors hover:bg-brand-hover"
                >
                  <span>Explore 2027 Watchlist</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="#methodology"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-text transition-colors hover:border-brand/70 hover:bg-surface-2"
                >
                  <span>Architecture &amp; Palette</span>
                </Link>
              </div>

              {/* Compact telemetry key figures */}
              <dl className="grid grid-cols-3 gap-3 border-t border-border/80 pt-6">
                <div className="rounded-xl border border-border/80 bg-surface/80 p-3.5">
                  <dt className="text-[11px] font-medium text-muted">
                    2027 Watchlist
                  </dt>
                  <dd className="font-display tabular-nums mt-1 text-2xl font-bold text-text">
                    {String(watchlist.length).padStart(2, "0")}
                  </dd>
                </div>
                <div className="rounded-xl border border-border/80 bg-surface/80 p-3.5">
                  <dt className="text-[11px] font-medium text-muted">
                    Flagship Poll
                  </dt>
                  <dd className="font-display tabular-nums mt-1 text-2xl font-bold text-live-text">
                    18 Apr
                  </dd>
                </div>
                <div className="rounded-xl border border-border/80 bg-surface/80 p-3.5">
                  <dt className="text-[11px] font-medium text-muted">
                    Rendering Core
                  </dt>
                  <dd className="font-display mt-1 text-xl font-bold text-brand sm:text-2xl">
                    SSG + ISR
                  </dd>
                </div>
              </dl>
            </div>

            {/* Right spotlight interactive preview */}
            <div className="lg:col-span-6">
              <FranceSpotlightCard data={francePreview} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <WatchlistSection elections={watchlist} />

        {/* Methodology, Architecture & Palette Showcase */}
        <section
          id="methodology"
          className="scroll-mt-24 border-t border-border/80 py-14 sm:py-16"
        >
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-semibold tracking-wider text-brand uppercase">
              Platform Architecture &amp; Design System
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
              {overview.frontmatter.methodologyTitle}
            </h2>
            <p className="text-sm leading-relaxed text-muted sm:text-base">
              {overview.frontmatter.methodologyLead}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ARCHITECTURE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-bg text-brand">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="rounded-md border border-border bg-bg px-2 py-0.5 font-mono text-[10px] font-semibold text-muted">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="font-display mt-4 text-base font-bold text-text">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            {/* Markdown-rendered editorial guide */}
            <div className="rounded-2xl border border-border bg-surface p-6 lg:col-span-7">
              <MarkdownRenderer blocks={overview.blocks} />
            </div>

            {/* Chart Palette + Phased Route Map */}
            <div className="space-y-6 lg:col-span-5">
              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="font-display text-lg font-bold text-text">
                  Non-Partisan Chart Scale (--d1 to --d8)
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  Eight colorblind-safe tones decoupled from party identities. Per-race
                  datasets override these variables whenever certified party hex colors apply.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {siteConfig.chartTokens.map((item) => (
                    <div
                      key={item.token}
                      className="flex items-center gap-2.5 rounded-xl border border-border bg-bg/70 px-3 py-2"
                    >
                      <span
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 rounded-md border border-black/15"
                        style={{ backgroundColor: `var(${item.token})` }}
                      />
                      <div className="min-w-0">
                        <div className="font-mono text-[11px] font-semibold text-text">
                          {item.token}
                        </div>
                        <div className="truncate text-[11px] text-muted">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-6">
                <h3 className="font-display text-lg font-bold text-text">
                  Phased Route Rollout
                </h3>
                <div className="mt-3 space-y-2">
                  {siteConfig.plannedRoutes.map((route) => (
                    <div
                      key={route.path}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-bg/70 px-3.5 py-2.5 text-xs"
                    >
                      <div className="min-w-0">
                        {route.phase === "Live" ? (
                          <Link
                            href={route.path}
                            className="block truncate font-mono font-semibold text-brand hover:underline"
                          >
                            {route.path}
                          </Link>
                        ) : (
                          <div className="truncate font-mono font-semibold text-text">
                            {route.path}
                          </div>
                        )}
                        <div className="truncate text-muted">{route.role}</div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-muted">
                          {route.rendering}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                            route.phase === "Live"
                              ? "bg-live-bg text-live-text"
                              : "bg-brand/15 text-brand"
                          }`}
                        >
                          {route.phase}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="scroll-mt-24 border-t border-border/80 py-14 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="space-y-2 lg:col-span-4">
              <div className="text-xs font-semibold tracking-wider text-brand uppercase">
                Frequently Asked Questions
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
                Coverage, methodology &amp; roadmap
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                Questions and structured FAQPage schema loaded directly from{" "}
                <code className="rounded border border-border bg-surface px-1.5 py-0.5 text-xs text-brand">
                  content/homepage/overview.md
                </code>
                .
              </p>
            </div>
            <div className="lg:col-span-8">
              <FaqAccordion faqs={overview.frontmatter.faqs} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
