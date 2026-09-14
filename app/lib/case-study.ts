export interface CaseStudySection {
  readonly id: string;
  readonly label: string;
  readonly eyebrow: string;
  readonly body: readonly string[];
}

export interface CaseStudy {
  readonly slug: string;
  readonly number: string;
  readonly title: string;
  readonly category: string;
  readonly year: string;
  readonly role: string;
  readonly description: string;
  readonly image?: string;
  readonly site?: string;
  readonly sections: readonly CaseStudySection[];
}

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: "nova-dashboard",
    number: "01",
    title: "Nova Dashboard",
    category: "Product Engineering",
    year: "2026",
    role: "Product Engineering",
    description:
      "A real-time analytics platform for monitoring product performance, user engagement, and system health across multiple services.",
    sections: [
      {
        id: "overview",
        label: "Overview",
        eyebrow: "Project",
        body: [
          "Nova is a real-time analytics platform that gives product teams a single surface for product performance, user engagement, and system health. It replaces a stack of per-service dashboards that never lined up with each other.",
          "Nova's design principle is that a metric is only useful when it can be traced — every number on the page links back to the query, the event, and the service that produced it.",
        ],
      },
      {
        id: "challenge",
        label: "Challenge",
        eyebrow: "Framing",
        body: [
          "Each service team had its own dashboard with its own definition of active users, uptime, and latency. The same chart meant different things in different tools, so cross-team reviews spent more time reconciling numbers than acting on them.",
          "The core problem was not charting — it was agreeing on a shared model of what to measure in the first place.",
        ],
      },
      {
        id: "approach",
        label: "Approach",
        eyebrow: "Process",
        body: [
          "We started with a metric dictionary: every term Nova displays has one canonical definition, owned by the team that produces the data. Dashboards reference the dictionary instead of re-defining numbers inline.",
          "Design and engineering worked from the same spec — the metric model became the source of truth for both the schema and the UI copy.",
        ],
      },
      {
        id: "design",
        label: "Design",
        eyebrow: "Interface",
        body: [
          "The interface is built around a small set of layout primitives: sparkline, breakdown, compare, and alert. Anything a team needs to understand can be assembled from those four atoms.",
          "Every card has a 'trace' affordance that walks from the headline number down to the underlying event stream — making the data auditable without leaving the page.",
        ],
      },
      {
        id: "engineering",
        label: "Engineering",
        eyebrow: "Build",
        body: [
          "The frontend streams time-series data over a WebSocket channel and renders it into canvas-backed sparklines, keeping the main thread quiet even with dozens of live tiles mounted.",
          "Query results are cached by a normalized key, so two cards asking the same question share one request and one update path.",
        ],
      },
      {
        id: "outcome",
        label: "Outcome",
        eyebrow: "Impact",
        body: [
          "Cross-team reviews went from reconciling spreadsheets to reading one set of numbers. Time-to-answer for a 'is this healthy?' question dropped from minutes to seconds.",
          "The metric dictionary became the default starting point for new tooling across the org — Nova is now the front door for product analytics.",
        ],
      },
    ],
  },
  {
    slug: "relay",
    number: "02",
    title: "Relay",
    category: "Design + Engineering",
    year: "2025",
    role: "Design + Engineering",
    description:
      "A collaborative design tool that bridges the gap between design intent and engineering implementation with live component preview.",
    sections: [
      {
        id: "overview",
        label: "Overview",
        eyebrow: "Project",
        body: [
          "Relay is a collaborative design tool built around one idea: the design token is the handoff. Engineers preview live components as they are designed, instead of receiving screenshots after the fact.",
          "It connects the design canvas to real component code, so a stroke change in the design file is always a diff the engineer can review.",
        ],
      },
      {
        id: "problem",
        label: "Problem",
        eyebrow: "Framing",
        body: [
          "Design handoff is a translation step with no feedback loop: the designer finishes, the engineer re-builds, and the two drift apart over the next release cycle.",
          "The missing layer was a shared artifact that both sides could read and change without leash-trading a Figma link.",
        ],
      },
      {
        id: "approach",
        label: "Approach",
        eyebrow: "Process",
        body: [
          "Rather than building a 'design to code' exporter, Relay treats the component as the unit of collaboration. The component's props ARE its parameters, and the design canvas renders those props live.",
          "We piloted with three in-house design systems to keep the model honest before generalizing.",
        ],
      },
      {
        id: "design",
        label: "Design",
        eyebrow: "Interface",
        body: [
          "The canvas and the code preview sit on one split plane. Changing a token animates the preview in place, so the relationship between input and output is visible in real time.",
          "A diff rail tracks every change between two versions of a component, rendered as a visual diff instead of a code diff.",
        ],
      },
      {
        id: "engineering",
        label: "Engineering",
        eyebrow: "Build",
        body: [
          "Relay renders component previews inside sandboxed iframes, each wired to the token graph through a shared reactive module.",
          "The token graph is the single store — the design canvas, the preview, and the export all read from one source of truth.",
        ],
      },
      {
        id: "outcome",
        label: "Outcome",
        eyebrow: "Impact",
        body: [
          "The handoff conversation moved from chat threads to component diffs. Designers started catching implementation drift in preview, before it shipped.",
          "The pilot teams reported that the median time from design sign-off to a mergeable component dropped by roughly a third.",
        ],
      },
    ],
  },
  {
    slug: "arclight-ai",
    number: "03",
    title: "Arclight AI",
    category: "AI + Product",
    year: "2025",
    role: "AI + Product",
    description:
      "An AI-powered content pipeline that generates, edits, and publishes structured product documentation from natural language.",
    sections: [
      {
        id: "overview",
        label: "Overview",
        eyebrow: "Project",
        body: [
          "Arclight turns rough notes into structured product documentation — release notes, changelogs, and guides — through an AI pipeline that the team can review at every step.",
          "The pipeline is designed for trust: nothing is published that hasn't passed through a human checkpoint, and every sentence is traceable to a source note.",
        ],
      },
      {
        id: "challenge",
        label: "Challenge",
        eyebrow: "Framing",
        body: [
          "Documentation rotted because it was written once and forgotten. The effort wasn't in drafting — it was in keeping docs aligned with code across every release.",
          "We needed a system that made maintenance cheaper than rewriting, not a generator that produced nicer-looking drafts of the same stale content.",
        ],
      },
      {
        id: "design",
        label: "Design",
        eyebrow: "Interface",
        body: [
          "The interface is a review lane rather than a chat: notes on one side, generated drafts on the other, and a checkpoint between them. Every generated change is a set of annotated edits, not a fresh wall of text.",
          "Sources are hyperlinked inline, so reviewers can verify any claim by jumping to the underlying note.",
        ],
      },
      {
        id: "engineering",
        label: "Engineering",
        eyebrow: "Build",
        body: [
          "The pipeline is a sequence of small, typed stages — extract, outline, draft, review, publish — each with its own cache. Re-running on new notes only re-generates the stages that changed.",
          "We version every artifact in the pipeline, which turned 'did the model regress?' into a diff-able question.",
        ],
      },
      {
        id: "outcome",
        label: "Outcome",
        eyebrow: "Impact",
        body: [
          "Docs went from an end-of-release scramble to a continuous flow. Publications track against code merges instead of calendar gaps.",
          "The checkpoint model meant reviewers spent time on substance — verifying, not rewriting — and trust in the generated output grew release over release.",
        ],
      },
    ],
  },
  {
    slug: "verdant",
    number: "04",
    title: "Verdant",
    category: "Brand + Frontend",
    year: "2024",
    role: "Product Engineering",
    description:
      "A sustainability tracking dashboard for teams to measure, report, and reduce their environmental footprint.",
    sections: [
      {
        id: "overview",
        label: "Overview",
        eyebrow: "Project",
        body: [
          "Verdant is a sustainability tracking dashboard that helps teams measure, report against targets, and reduce their environmental footprint year over year.",
          "It turns a compliance chore into an operational signal — the same way teams track uptime, they now track emissions.",
        ],
      },
      {
        id: "problem",
        label: "Problem",
        eyebrow: "Framing",
        body: [
          "Sustainability data lived in spreadsheets that were assembled annually, reported once, and then forgotten. Nobody could answer 'are we getting better?' without a week of work.",
          "The product's job was to make the number continuous — and to make reduction a daily activity rather than an annual report.",
        ],
      },
      {
        id: "process",
        label: "Process",
        eyebrow: "Process",
        body: [
          "We built the taxonomy first: every data source maps to a standard scope classification, so mixed-format reports from different facilities fold into one ledger.",
          "Reporting templates were co-designed with the finance and facilities teams who actually produce the data.",
        ],
      },
      {
        id: "design",
        label: "Design",
        eyebrow: "Interface",
        body: [
          "The dashboard is built around a progress-to-target ring, with everything else — breakdowns, trends, initiatives — orbiting it.",
          "Reduction initiatives are rendered as live 'contributors' so a team can see which programs are moving the needle month to month.",
        ],
      },
      {
        id: "outcome",
        label: "Outcome",
        eyebrow: "Impact",
        body: [
          "Teams adopted Verdant as their operating rhythm for sustainability — monthly, not annual. Reporting time went from weeks to minutes.",
          "The continuous ledger made external reporting a by-product of day-to-day tracking rather than a separate project.",
        ],
      },
    ],
  },
  {
    slug: "pathao-connect",
    number: "05",
    title: "Pathao Connect",
    category: "Product Design · Engineering",
    year: "2025",
    role: "Product Design · Engineering",
    description:
      "Formalizing street side bike rides without changing their nature and making them safer.",
    sections: [
      {
        id: "overview",
        label: "Overview",
        eyebrow: "Project",
        body: [
          "Pathao Connect brings street-side bike riders into a lightly-structured experience: a rider can publish availability, match with a demand, and complete a fare — without a rigid dispatch model.",
          "The goal was to add safety and trust to an existing informal market, not to replace it with something that forgets how the market actually works.",
        ],
      },
      {
        id: "challenge",
        label: "Challenge",
        eyebrow: "Framing",
        body: [
          "These riders already have a working system: reputation, routes, and fares governed by local knowledge. Imposing a heavy app from above would destroy the very adaptation that makes the market work.",
          "The product challenge was to add a thin trust layer — verified identity, ride record, dispute trail — without taxing the flow.",
        ],
      },
      {
        id: "research",
        label: "Research",
        eyebrow: "Research",
        body: [
          "We spent field time with riders before touching a wireframe: when they price a ride, how they screen passengers, and where the current system breaks and puts people at risk.",
          "The recurring pattern was asymmetry — riders took the risk of identity, distance, and payment while passengers gave nothing back.",
        ],
      },
      {
        id: "solution",
        label: "Solution",
        eyebrow: "Design",
        body: [
          "Connect layers three guarantees onto the existing flow: a verified rider profile, a fare locked before pickup, and a shared trip record that both sides can annotate after the ride.",
          "The interface stays radically simple — a demand list, a confirm button, a fare — because everything else already works.",
        ],
      },
      {
        id: "outcome",
        label: "Outcome",
        eyebrow: "Impact",
        body: [
          "Riders gained a portable reputation outside their local corner, and passengers gained recourse they previously had none of.",
          "Dispute resolution moved from shouting matches to a shared record — the safety gain was measurable in ride quality scores.",
        ],
      },
    ],
  },
  {
    slug: "parcel-courier-merge",
    number: "06",
    title: "Parcel × Courier Merge",
    category: "Product Design · Engineering",
    year: "2025",
    role: "Product Design · Engineering",
    description:
      "Merging two delivery services into one address-first flow that routes every order to the right service.",
    sections: [
      {
        id: "overview",
        label: "Overview",
        eyebrow: "Project",
        body: [
          "Two delivery services — parcel and courier — were merged into one product. The savings came from routing: one checkout should know whether a shipment is parcel-sized or courier-sized and pick the right service automatically.",
          "The result is an address-first flow: the customer enters where it goes before choosing how, and the platform does the classification.",
        ],
      },
      {
        id: "problem",
        label: "Problem",
        eyebrow: "Framing",
        body: [
          "Two separate apps meant two checkouts, two rate tables, and a 50/50 guess for customers about which service they needed. The merge was an engineering decision that customers had to live through.",
          "The UX problem was making the complexity invisible: the customer should never have to know what parcel vs courier means.",
        ],
      },
      {
        id: "decision",
        label: "Decision",
        eyebrow: "Model",
        body: [
          "We chose the address as the unit of truth. Everything downstream — service selection, pricing, ETA — derives from the destination and the package's physical dimensions.",
          "Classification happens server-side so the customer sees one seamless rate instead of a menu of services.",
        ],
      },
      {
        id: "design",
        label: "Design",
        eyebrow: "Interface",
        body: [
          "The merged flow is a single three-step journey: address, details, review. The service choice is presented as a recommendation with the reasons behind it, not a forced selection.",
          "For repeat customers, a saved profile skips straight to review — the merged product is faster than either original app.",
        ],
      },
      {
        id: "outcome",
        label: "Outcome",
        eyebrow: "Impact",
        body: [
          "Drop-off at the first step of checkout fell as customers stopped being asked to self-serve a decision they didn't want to make.",
          "The routing model removed thousands of missed-classification re-bookings per month — the merge paid for itself in fewer touchpoints.",
        ],
      },
    ],
  },
] as const;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug);
}