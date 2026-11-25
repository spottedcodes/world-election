import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import type { MarkdownBlock, LegalSlug } from "@/lib/content";
import { getSiteConfig } from "@/lib/data";
import type { LegalFrontmatter } from "@/lib/schemas";

export function LegalDocumentView({
  currentSlug,
  frontmatter,
  blocks,
}: {
  currentSlug: LegalSlug;
  frontmatter: LegalFrontmatter;
  blocks: MarkdownBlock[];
}) {
  const siteConfig = getSiteConfig();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text transition-colors hover:border-brand/70 hover:bg-surface-2"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
          <span>Back to Home</span>
        </Link>

        <nav aria-label="Legal documents" className="flex flex-wrap gap-2">
          {siteConfig.legalLinks.map((link) => {
            const isCurrent = link.href === `/${currentSlug}`;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isCurrent
                    ? "border-brand bg-brand text-brand-contrast"
                    : "border-border bg-surface text-muted hover:text-text"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <article className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <header className="border-b border-border/80 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-1 text-xs font-medium text-brand">
            Legal &amp; Governance
          </div>
          <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {frontmatter.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            {frontmatter.summary}
          </p>
          <p className="tabular-nums mt-4 text-xs font-medium text-muted">
            Last updated: {frontmatter.lastUpdated}
          </p>
        </header>

        <div className="pt-6">
          <MarkdownRenderer blocks={blocks} />
        </div>
      </article>
    </div>
  );
}
