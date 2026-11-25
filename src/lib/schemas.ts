import { z } from "zod";

export const SiteConfigSchema = z.object({
  brand: z.object({
    name: z.string(),
    shortName: z.string(),
    tagline: z.string(),
    description: z.string(),
    contactEmail: z.string(),
    baseUrl: z.string(),
  }),
  navigation: z.array(
    z.object({
      label: z.string(),
      href: z.string(),
    })
  ),
  plannedRoutes: z.array(
    z.object({
      path: z.string(),
      role: z.string(),
      phase: z.string(),
      rendering: z.string(),
    })
  ),
  legalLinks: z.array(
    z.object({
      label: z.string(),
      href: z.string(),
    })
  ),
  chartTokens: z.array(
    z.object({
      token: z.string(),
      name: z.string(),
    })
  ),
});

export const WatchlistElectionSchema = z.object({
  id: z.string(),
  country: z.string(),
  countryCode: z.string().length(2),
  region: z.enum(["Europe", "Americas", "Africa", "Asia-Pacific", "Middle East"]),
  title: z.string(),
  type: z.string(),
  dateDisplay: z.string(),
  isoDate: z.string().nullable(),
  status: z.enum(["priority", "scheduled", "window"]),
  system: z.string(),
  plannedRoute: z.string(),
  summary: z.string(),
});

export const WatchlistArraySchema = z.array(WatchlistElectionSchema);

export const FrancePreviewSchema = z.object({
  country: z.string(),
  countryCode: z.string(),
  title: z.string(),
  plannedPath: z.string(),
  countryHubPath: z.string(),
  electoralSystem: z.string(),
  termLengthYears: z.number(),
  localTimezone: z.string(),
  round1Iso: z.string(),
  round1Label: z.string(),
  round2Iso: z.string(),
  round2Label: z.string(),
  pollCloseUtc: z.string(),
  previewNotice: z.string(),
  previewTracks: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      shortCode: z.string(),
      tokenVar: z.string(),
      partyOverrideColor: z.string(),
      baseShare: z.number(),
      baseVotes: z.number(),
    })
  ),
});

export const HomeOverviewFrontmatterSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  methodologyTitle: z.string(),
  methodologyLead: z.string(),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

export const LegalFrontmatterSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  title: z.string(),
  lastUpdated: z.string(),
  summary: z.string(),
});

export const FranceHubFrontmatterSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  heroEyebrow: z.string(),
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

const ParliamentGroupSchema = z.object({
  code: z.string(),
  name: z.string(),
  seats: z.number(),
  bloc: z.string(),
  color: z.string(),
});

export const FranceHubDataSchema = z.object({
  country: z.string(),
  countryCode: z.string(),
  officialName: z.string(),
  timezone: z.string(),
  lastUpdated: z.string(),
  nextElection: z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(),
    round1Iso: z.string(),
    round1Label: z.string(),
    round2Iso: z.string(),
    round2Label: z.string(),
    pollCloseLabel: z.string(),
    system: z.string(),
    plannedHref: z.string(),
    previewHref: z.string(),
  }),
  quickFacts: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      note: z.string(),
    })
  ),
  upcomingElections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      body: z.string(),
      dateLabel: z.string(),
      status: z.enum(["confirmed", "scheduled", "unconfirmed"]),
      notes: z.string(),
    })
  ),
  presidentialHistory: z.array(
    z.object({
      year: z.number(),
      winner: z.string(),
      winnerParty: z.string(),
      opponent: z.string(),
      opponentParty: z.string(),
      winnerR1: z.number(),
      opponentR1: z.number(),
      winnerR2: z.number(),
      opponentR2: z.number(),
      turnoutR1: z.number(),
      turnoutR2: z.number(),
      plannedRoute: z.string(),
    })
  ),
  nationalAssembly: z.object({
    chamberName: z.string(),
    totalSeats: z.number(),
    majorityThreshold: z.number(),
    lastElectionDates: z.string(),
    lastElectionTurnout: z.string(),
    seatChangesNote: z.string(),
    july2024Blocs: z.array(
      z.object({
        bloc: z.string(),
        approxSeats: z.string(),
        color: z.string(),
      })
    ),
    groups: z.array(ParliamentGroupSchema),
  }),
  senate: z.object({
    chamberName: z.string(),
    totalSeats: z.number(),
    majorityThreshold: z.number(),
    lastRenewalDate: z.string(),
    seatsRenewed: z.number(),
    electoralCollegeNote: z.string(),
    renewalHighlight: z.string(),
    groups: z.array(ParliamentGroupSchema),
  }),
  parties: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      ideology: z.string(),
      color: z.string(),
      assemblySeats: z.string(),
      senateSeats: z.string(),
      recentResult: z.string(),
    })
  ),
  pollingSnapshot: z.object({
    statusLabel: z.string(),
    sourcesSummary: z.string(),
    caveat: z.string(),
    contenders: z.array(
      z.object({
        name: z.string(),
        party: z.string(),
        minPct: z.number(),
        maxPct: z.number(),
        color: z.string(),
      })
    ),
  }),
  turnoutTrends: z.object({
    presidential: z.array(
      z.object({ year: z.number(), r1: z.number(), r2: z.number() })
    ),
    legislative: z.array(
      z.object({ year: z.number(), r1: z.number(), r2: z.number() })
    ),
  }),
  otherElectionTypes: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      lastHeld: z.string(),
      turnout: z.string(),
      seats: z.string(),
      nextCycle: z.string(),
      summary: z.string(),
    })
  ),
  dataSources: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      url: z.string(),
    })
  ),
});

export const FranceDepartmentGeoSchema = z.object({
  viewBox: z.string(),
  petiteCouronneViewBox: z.string(),
  overseasViewBox: z.string(),
  metropolitan: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      d: z.string(),
      cx: z.number(),
      cy: z.number(),
    })
  ),
  petiteCouronne: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      d: z.string(),
    })
  ),
  overseas: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      d: z.string(),
    })
  ),
});

const DepartmentRoundEntrySchema = z.object({
  code: z.string(),
  name: z.string(),
  turnout: z.number(),
  validVotes: z.number(),
  winnerId: z.string(),
  winnerName: z.string(),
  winnerColor: z.string(),
  winnerShare: z.number(),
  margin: z.number(),
  topCandidates: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      party: z.string(),
      color: z.string(),
      votes: z.number(),
      share: z.number(),
    })
  ),
});

export const FranceDepartmentResultsSchema = z.record(
  z.enum(["2022-r2", "2022-r1", "2017-r2", "2017-r1"]),
  z.record(z.string(), DepartmentRoundEntrySchema)
);

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type WatchlistElection = z.infer<typeof WatchlistElectionSchema>;
export type FrancePreview = z.infer<typeof FrancePreviewSchema>;
export type HomeOverviewFrontmatter = z.infer<typeof HomeOverviewFrontmatterSchema>;
export type LegalFrontmatter = z.infer<typeof LegalFrontmatterSchema>;
export type FranceHubFrontmatter = z.infer<typeof FranceHubFrontmatterSchema>;
export type FranceHubData = z.infer<typeof FranceHubDataSchema>;
export type FranceDepartmentGeo = z.infer<typeof FranceDepartmentGeoSchema>;
export type FranceDepartmentResults = z.infer<typeof FranceDepartmentResultsSchema>;
export type DepartmentRoundEntry = z.infer<typeof DepartmentRoundEntrySchema>;
export type ParliamentGroup = z.infer<typeof ParliamentGroupSchema>;
