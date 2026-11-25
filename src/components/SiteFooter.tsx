import Link from "next/link";
import type { SiteConfig } from "@/lib/schemas";

export function SiteFooter({ config }: { config: SiteConfig }) {
  return (
    <footer className="mt-auto border-t border-border bg-surface/80">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand summary */}
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-xl font-bold tracking-tight text-text">
                {config.brand.name}
              </span>
              <span className="rounded-full border border-border bg-bg px-2.5 py-0.5 text-[11px] font-medium text-brand">
                Phase 0 Foundation
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              {config.brand.description}
            </p>
            <p className="text-xs text-muted">
              Editorial &amp; data desk:{" "}
              <a
                href={`mailto:${config.brand.contactEmail}`}
                className="font-medium text-brand underline-offset-4 hover:underline"
              >
                {config.brand.contactEmail}
              </a>
            </p>
          </div>

          {/* Planned route rollout */}
          <div className="space-y-3 md:col-span-4">
            <h2 className="font-display text-sm font-semibold tracking-wide text-text uppercase">
              Planned Route Rollout
            </h2>
            <ul className="space-y-2">
              {config.plannedRoutes.map((route) => (
                <li
                  key={route.path}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/80 bg-bg/60 px-3 py-2 text-xs"
                >
                  <div className="min-w-0">
                    {route.phase === "Live" ? (
                      <Link
                        href={route.path}
                        className="block truncate font-mono text-[11px] font-semibold text-brand hover:underline"
                      >
                        {route.path}
                      </Link>
                    ) : (
                      <div className="truncate font-mono text-[11px] font-semibold text-text">
                        {route.path}
                      </div>
                    )}
                    <div className="truncate text-muted">{route.role}</div>
                  </div>
                  <span
                    className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
                      route.phase === "Live"
                        ? "border-live-border bg-live-bg text-live-text"
                        : "border-border bg-surface text-brand"
                    }`}
                  >
                    {route.phase}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & standards links */}
          <div className="space-y-3 md:col-span-3">
            <h2 className="font-display text-sm font-semibold tracking-wide text-text uppercase">
              Legal &amp; Standards
            </h2>
            <ul className="space-y-2 text-sm">
              {config.legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <h3 className="font-display text-xs font-semibold tracking-wide text-text uppercase">
                Chart Standards
              </h3>
              <div className="mt-2 flex items-center gap-1.5" aria-label="Eight colorblind-safe chart tokens">
                {config.chartTokens.map((token) => (
                  <span
                    key={token.token}
                    title={`${token.token}: ${token.name}`}
                    className="h-3.5 w-3.5 rounded-sm border border-black/15"
                    style={{ backgroundColor: `var(${token.token})` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/80 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; 2026 {config.brand.name}. Independent civic data &amp; electoral tracker.
          </p>
          <p>
            Official national electoral commissions remain the sole certifying authority.
          </p>
        </div>
      </div>
    </footer>
  );
}
