/* ---------------------------------------------------------------------------
   Project registry

   Single curated source of truth for every project. Content lives in the
   codebase — no backend, no CMS, no API.

   - `getAllProjects()`       — everything, in display order
   - `getProjectBySlug()`     — single project (pages call notFound() themselves)
   - `getFeaturedProjects()`  — the four shown on the homepage Selected Work grid
   - `getProjectsBySlugs()`   — curated subsets (e.g. homepage Case Studies)
   - `getNextProject()`       — wrap-around "next project" for case study footers
   --------------------------------------------------------------------------- */

export type TechnologyId =
  | "figma"
  | "nextjs"
  | "react"
  | "typescript"
  | "tailwindcss"
  | "gsap"
  | "python"
  | "openai";

export interface ProjectTechnology {
  readonly id: TechnologyId;
  readonly label: string;
}

export type SectionKind =
  | "overview"
  | "challenge"
  | "approach"
  | "design"
  | "engineering"
  | "interaction"
  | "outcome"
  | "reflection";

export interface ProjectMedia {
  readonly src: string;
  readonly alt: string;
  readonly caption?: string;
}

export interface DiagramNode {
  readonly id: string;
  readonly label: string;
  readonly layer?: "client" | "server" | "data" | "external";
}

export interface DiagramEdge {
  readonly from: string;
  readonly to: string;
  readonly label?: string;
}

export interface DiagramFlow {
  readonly nodes: readonly DiagramNode[];
  readonly edges: readonly DiagramEdge[];
  readonly caption?: string;
}

export interface ProjectSection {
  readonly id: string;
  readonly label: string;
  readonly kicker: string;
  readonly kind: SectionKind;
  readonly intro: readonly string[];
  readonly bullets?: readonly string[];
  readonly media?: ProjectMedia;
  readonly gallery?: readonly ProjectMedia[];
  readonly diagram?: DiagramFlow;
}

export interface Project {
  readonly slug: string;
  readonly number: string;
  readonly title: string;
  /** One-line summary — used on cards and as the meta description. */
  readonly description: string;
  readonly category: string;
  readonly year: string;
  readonly role: string;
  readonly client?: string;
  readonly status: string;
  readonly duration?: string;
  readonly stack: readonly ProjectTechnology[];
  readonly hero: {
    readonly src: string;
    readonly alt: string;
  };
  readonly thumbnail: {
    readonly src: string;
    readonly alt: string;
  };
  readonly links?: {
    readonly live?: string;
    readonly github?: string;
  };
  readonly featured?: boolean;
  readonly sections: readonly ProjectSection[];
  readonly reflection?: {
    readonly whatIdChange: readonly string[];
    readonly whatILearned: readonly string[];
    readonly keyDecision: readonly string[];
  };
}

const IMG = {
  hero: (slug: string) => `/projects/${slug}/hero.png`,
  thumb: (slug: string) => `/projects/${slug}/thumbnail.png`,
  gallery: (slug: string, n: number) => `/projects/${slug}/gallery-${n}.png`,
} as const;

export const PROJECTS: readonly Project[] = [
  {
    slug: "nova-dashboard",
    number: "01",
    title: "Nova Dashboard",
    description:
      "A real-time analytics platform for monitoring product performance, user engagement, and system health across multiple services.",
    category: "Product Engineering",
    year: "2026",
    role: "Product Engineering",
    status: "In production",
    stack: [
      { id: "react", label: "React" },
      { id: "nextjs", label: "Next.js" },
      { id: "typescript", label: "TypeScript" },
      { id: "tailwindcss", label: "Tailwind" },
      { id: "gsap", label: "GSAP" },
      { id: "python", label: "Python" },
    ],
    hero: { src: IMG.hero("nova-dashboard"), alt: "Nova Dashboard analytics interface" },
    thumbnail: { src: IMG.thumb("nova-dashboard"), alt: "Nova Dashboard project thumbnail" },
    featured: true,
    sections: [
      {
        id: "overview",
        label: "Overview",
        kicker: "Project",
        kind: "overview",
        intro: [
          "Nova is a real-time analytics platform that gives product teams a single surface for product performance, user engagement, and system health. It replaces a stack of per-service dashboards that never lined up with each other.",
          "Nova's design principle is that a metric is only useful when it can be traced — every number on the page links back to the query, the event, and the service that produced it.",
        ],
      },
      {
        id: "challenge",
        label: "Challenge",
        kicker: "Framing",
        kind: "challenge",
        intro: [
          "Each service team had its own dashboard with its own definition of active users, uptime, and latency. The same chart meant different things in different tools, so cross-team reviews spent more time reconciling numbers than acting on them.",
          "The core problem was not charting — it was agreeing on a shared model of what to measure in the first place.",
        ],
      },
      {
        id: "approach",
        label: "Approach",
        kicker: "Process",
        kind: "approach",
        intro: [
          "We started with a metric dictionary: every term Nova displays has one canonical definition, owned by the team that produces the data. Dashboards reference the dictionary instead of re-defining numbers inline.",
          "Design and engineering worked from the same spec — the metric model became the source of truth for both the schema and the UI copy.",
        ],
        bullets: [
          "One canonical definition per metric, owned by the producing team.",
          "The metric model is the shared source of truth for schema and UI.",
          "Cross-team reviews read one set of numbers, not five.",
        ],
      },
      {
        id: "design",
        label: "Design",
        kicker: "Interface",
        kind: "design",
        intro: [
          "The interface is built around a small set of layout primitives: sparkline, breakdown, compare, and alert. Anything a team needs to understand can be assembled from those four atoms.",
          "Every card has a 'trace' affordance that walks from the headline number down to the underlying event stream — making the data auditable without leaving the page.",
        ],
        gallery: [
          { src: IMG.gallery("nova-dashboard", 1), alt: "Nova Dashboard metric dictionary", caption: "The metric dictionary — every term defined once." },
          { src: IMG.gallery("nova-dashboard", 2), alt: "Nova Dashboard trace flight", caption: "Tracing a headline number to its event stream." },
          { src: IMG.gallery("nova-dashboard", 3), alt: "Nova Dashboard live tiles", caption: "Dozens of live tiles streaming over WebSocket." },
        ],
      },
      {
        id: "engineering",
        label: "Engineering",
        kicker: "Build",
        kind: "engineering",
        intro: [
          "The frontend streams time-series data over a WebSocket channel and renders it into canvas-backed sparklines, keeping the main thread quiet even with dozens of live tiles mounted.",
          "Query results are cached by a normalized key, so two cards asking the same question share one request and one update path.",
        ],
        diagram: {
          nodes: [
            { id: "client", label: "React Client", layer: "client" },
            { id: "websocket", label: "WebSocket Channel", layer: "server" },
            { id: "cache", label: "Normalized Query Cache", layer: "server" },
            { id: "api", label: "Metrics API", layer: "server" },
            { id: "db", label: "Time-Series DB", layer: "data" },
          ],
          edges: [
            { from: "client", to: "websocket", label: "Subscribe" },
            { from: "websocket", to: "cache", label: "Normalize" },
            { from: "cache", to: "api", label: "Deduplicate" },
            { from: "api", to: "db", label: "Query" },
          ],
          caption: "Streaming architecture — WebSocket delivers data, cache deduplicates requests.",
        },
      },
      {
        id: "outcome",
        label: "Outcome",
        kicker: "Impact",
        kind: "outcome",
        intro: [
          "Cross-team reviews went from reconciling spreadsheets to reading one set of numbers. Time-to-answer for a 'is this healthy?' question dropped from minutes to seconds.",
          "The metric dictionary became the default starting point for new tooling across the org — Nova is now the front door for product analytics.",
        ],
      },
    ],
    reflection: {
      whatIdChange: [
        "I would invest in a query builder UI earlier — letting teams explore data without engineering support would have accelerated adoption.",
        "The canvas sparklines work well but add complexity; for v2 I'd evaluate whether SVG with virtualized rendering could match the performance at lower cost.",
      ],
      whatILearned: [
        "A shared data model is more valuable than a shared UI. When teams agree on what a metric means, the interface almost designs itself.",
        "Streaming data requires a different mental model for state — you're not fetching, you're subscribing. That distinction matters for cache design.",
      ],
      keyDecision: [
        "Making the metric dictionary the source of truth for both schema and UI copy was the decision that made everything else coherent.",
      ],
    },
  },
  {
    slug: "relay",
    number: "02",
    title: "Relay",
    description:
      "A collaborative design tool that bridges the gap between design intent and engineering implementation with live component preview.",
    category: "Design + Engineering",
    year: "2025",
    role: "Design + Engineering",
    status: "In production",
    stack: [
      { id: "figma", label: "Figma" },
      { id: "react", label: "React" },
      { id: "typescript", label: "TypeScript" },
      { id: "gsap", label: "GSAP" },
    ],
    hero: { src: IMG.hero("relay"), alt: "Relay design-to-code canvas" },
    thumbnail: { src: IMG.thumb("relay"), alt: "Relay project thumbnail" },
    featured: true,
    sections: [
      {
        id: "overview",
        label: "Overview",
        kicker: "Project",
        kind: "overview",
        intro: [
          "Relay is a collaborative design tool built around one idea: the design token is the handoff. Engineers preview live components as they are designed, instead of receiving screenshots after the fact.",
          "It connects the design canvas to real component code, so a stroke change in the design file is always a diff the engineer can review.",
        ],
      },
      {
        id: "challenge",
        label: "Challenge",
        kicker: "Framing",
        kind: "challenge",
        intro: [
          "Design handoff is a translation step with no feedback loop: the designer finishes, the engineer re-builds, and the two drift apart over the next release cycle.",
          "The missing layer was a shared artifact that both sides could read and change without leash-trading a Figma link.",
        ],
      },
      {
        id: "approach",
        label: "Approach",
        kicker: "Process",
        kind: "approach",
        intro: [
          "Rather than building a 'design to code' exporter, Relay treats the component as the unit of collaboration. The component's props ARE its parameters, and the design canvas renders those props live.",
          "We piloted with three in-house design systems to keep the model honest before generalizing.",
        ],
        bullets: [
          "Component props become the shared parameter surface.",
          "The design canvas renders real components, not mocks.",
          "Piloted against three design systems before generalizing.",
        ],
      },
      {
        id: "design",
        label: "Design",
        kicker: "Interface",
        kind: "design",
        intro: [
          "The canvas and the code preview sit on one split plane. Changing a token animates the preview in place, so the relationship between input and output is visible in real time.",
          "A diff rail tracks every change between two versions of a component, rendered as a visual diff instead of a code diff.",
        ],
        gallery: [
          { src: IMG.gallery("relay", 1), alt: "Relay split-plane canvas", caption: "Design canvas and live preview on one plane." },
          { src: IMG.gallery("relay", 2), alt: "Relay diff rail", caption: "Visual diff rail between component versions." },
          { src: IMG.gallery("relay", 3), alt: "Relay token animation", caption: "Token changes animate the preview in place." },
        ],
      },
      {
        id: "engineering",
        label: "Engineering",
        kicker: "Build",
        kind: "engineering",
        intro: [
          "Relay renders component previews inside sandboxed iframes, each wired to the token graph through a shared reactive module.",
          "The token graph is the single store — the design canvas, the preview, and the export all read from one source of truth.",
        ],
        diagram: {
          nodes: [
            { id: "canvas", label: "Design Canvas", layer: "client" },
            { id: "tokens", label: "Token Graph", layer: "server" },
            { id: "preview", label: "Component Preview", layer: "client" },
            { id: "export", label: "Code Export", layer: "server" },
          ],
          edges: [
            { from: "canvas", to: "tokens", label: "Write" },
            { from: "tokens", to: "preview", label: "React" },
            { from: "tokens", to: "export", label: "Serialise" },
          ],
          caption: "Token graph as the single source of truth — canvas, preview, and export read from one model.",
        },
      },
      {
        id: "outcome",
        label: "Outcome",
        kicker: "Impact",
        kind: "outcome",
        intro: [
          "The handoff conversation moved from chat threads to component diffs. Designers started catching implementation drift in preview, before it shipped.",
          "The pilot teams reported that the median time from design sign-off to a mergeable component dropped by roughly a third.",
        ],
      },
    ],
    reflection: {
      whatIdChange: [
        "The iframe sandboxing adds isolation but creates communication overhead. I'd explore Web Components or shadow DOM for lighter-weight encapsulation.",
        "Version history was added late — it should have been a first-class feature from day one since design is inherently iterative.",
      ],
      whatILearned: [
        "The best handoff tool is one that doesn't require either side to change their workflow. Relay worked because it met designers in Figma and engineers in code.",
        "Reactive data flow between design tools and code preview is fundamentally a state synchronization problem.",
      ],
      keyDecision: [
        "Treating component props as the shared parameter surface — rather than trying to export design files to code — was the architectural bet that made Relay useful.",
      ],
    },
  },
  {
    slug: "arclight-ai",
    number: "03",
    title: "Arclight AI",
    description:
      "An AI-powered content pipeline that generates, edits, and publishes structured product documentation from natural language.",
    category: "AI + Product",
    year: "2025",
    role: "AI + Product",
    status: "In production",
    stack: [
      { id: "nextjs", label: "Next.js" },
      { id: "react", label: "React" },
      { id: "typescript", label: "TypeScript" },
      { id: "openai", label: "OpenAI" },
      { id: "python", label: "Python" },
    ],
    hero: { src: IMG.hero("arclight-ai"), alt: "Arclight AI review lane interface" },
    thumbnail: { src: IMG.thumb("arclight-ai"), alt: "Arclight AI project thumbnail" },
    featured: true,
    sections: [
      {
        id: "overview",
        label: "Overview",
        kicker: "Project",
        kind: "overview",
        intro: [
          "Arclight turns rough notes into structured product documentation — release notes, changelogs, and guides — through an AI pipeline that the team can review at every step.",
          "The pipeline is designed for trust: nothing is published that hasn't passed through a human checkpoint, and every sentence is traceable to a source note.",
        ],
      },
      {
        id: "challenge",
        label: "Challenge",
        kicker: "Framing",
        kind: "challenge",
        intro: [
          "Documentation rotted because it was written once and forgotten. The effort wasn't in drafting — it was in keeping docs aligned with code across every release.",
          "We needed a system that made maintenance cheaper than rewriting, not a generator that produced nicer-looking drafts of the same stale content.",
        ],
      },
      {
        id: "design",
        label: "Design",
        kicker: "Interface",
        kind: "design",
        intro: [
          "The interface is a review lane rather than a chat: notes on one side, generated drafts on the other, and a checkpoint between them. Every generated change is a set of annotated edits, not a fresh wall of text.",
          "Sources are hyperlinked inline, so reviewers can verify any claim by jumping to the underlying note.",
        ],
        gallery: [
          { src: IMG.gallery("arclight-ai", 1), alt: "Arclight review lane", caption: "Notes in, annotated drafts out." },
          { src: IMG.gallery("arclight-ai", 2), alt: "Arclight inline sources", caption: "Every claim hyperlinked to its source note." },
          { src: IMG.gallery("arclight-ai", 3), alt: "Arclight checkpoint", caption: "Human checkpoint before anything publishes." },
        ],
      },
      {
        id: "engineering",
        label: "Engineering",
        kicker: "Build",
        kind: "engineering",
        intro: [
          "The pipeline is a sequence of small, typed stages — extract, outline, draft, review, publish — each with its own cache. Re-running on new notes only re-generates the stages that changed.",
          "We version every artifact in the pipeline, which turned 'did the model regress?' into a diff-able question.",
        ],
        diagram: {
          nodes: [
            { id: "notes", label: "Source Notes", layer: "data" },
            { id: "extract", label: "Extract", layer: "server" },
            { id: "outline", label: "Outline", layer: "server" },
            { id: "draft", label: "Draft", layer: "server" },
            { id: "review", label: "Human Review", layer: "external" },
            { id: "publish", label: "Publish", layer: "server" },
          ],
          edges: [
            { from: "notes", to: "extract", label: "Ingest" },
            { from: "extract", to: "outline", label: "Structure" },
            { from: "outline", to: "draft", label: "Generate" },
            { from: "draft", to: "review", label: "Checkpoint" },
            { from: "review", to: "publish", label: "Approve" },
          ],
          caption: "Typed pipeline — each stage caches independently, only changed stages re-generate.",
        },
      },
      {
        id: "outcome",
        label: "Outcome",
        kicker: "Impact",
        kind: "outcome",
        intro: [
          "Docs went from an end-of-release scramble to a continuous flow. Publications track against code merges instead of calendar gaps.",
          "The checkpoint model meant reviewers spent time on substance — verifying, not rewriting — and trust in the generated output grew release over release.",
        ],
      },
    ],
    reflection: {
      whatIdChange: [
        "I'd add a feedback loop from published docs back into the pipeline — tracking which sections get updated most often would help the AI prioritise accuracy.",
        "The typed stages work well but the boundaries between extract and outline could be blurrier — a joint model pass might produce better structure.",
      ],
      whatILearned: [
        "Human checkpoints are not a compromise — they're a feature. Trust grows when people know they're in the loop, not when they're told the AI is good enough.",
        "Versioning every artifact turned a black-box AI problem into a debuggable engineering problem.",
      ],
      keyDecision: [
        "Designing the pipeline as typed, cacheable stages rather than a monolithic generate-and-publish was what made the system maintainable.",
      ],
    },
  },
  {
    slug: "verdant",
    number: "04",
    title: "Verdant",
    description:
      "A sustainability tracking dashboard for teams to measure, report, and reduce their environmental footprint.",
    category: "Brand + Frontend",
    year: "2024",
    role: "Product Engineering",
    status: "Shipped",
    stack: [
      { id: "figma", label: "Figma" },
      { id: "nextjs", label: "Next.js" },
      { id: "typescript", label: "TypeScript" },
      { id: "tailwindcss", label: "Tailwind" },
    ],
    hero: { src: IMG.hero("verdant"), alt: "Verdant sustainability dashboard" },
    thumbnail: { src: IMG.thumb("verdant"), alt: "Verdant project thumbnail" },
    featured: true,
    sections: [
      {
        id: "overview",
        label: "Overview",
        kicker: "Project",
        kind: "overview",
        intro: [
          "Verdant is a sustainability tracking dashboard that helps teams measure, report against targets, and reduce their environmental footprint year over year.",
          "It turns a compliance chore into an operational signal — the same way teams track uptime, they now track emissions.",
        ],
      },
      {
        id: "challenge",
        label: "Challenge",
        kicker: "Framing",
        kind: "challenge",
        intro: [
          "Sustainability data lived in spreadsheets that were assembled annually, reported once, and then forgotten. Nobody could answer 'are we getting better?' without a week of work.",
          "The product's job was to make the number continuous — and to make reduction a daily activity rather than an annual report.",
        ],
      },
      {
        id: "approach",
        label: "Approach",
        kicker: "Process",
        kind: "approach",
        intro: [
          "We built the taxonomy first: every data source maps to a standard scope classification, so mixed-format reports from different facilities fold into one ledger.",
          "Reporting templates were co-designed with the finance and facilities teams who actually produce the data.",
        ],
        bullets: [
          "Standard scope taxonomy so mixed data folds into one ledger.",
          "Templates co-designed with the teams that produce the data.",
          "Reduction becomes a daily activity, not an annual report.",
        ],
      },
      {
        id: "design",
        label: "Design",
        kicker: "Interface",
        kind: "design",
        intro: [
          "The dashboard is built around a progress-to-target ring, with everything else — breakdowns, trends, initiatives — orbiting it.",
          "Reduction initiatives are rendered as live 'contributors' so a team can see which programs are moving the needle month to month.",
        ],
        gallery: [
          { src: IMG.gallery("verdant", 1), alt: "Verdant progress ring", caption: "Progress-to-target as the organizing form." },
          { src: IMG.gallery("verdant", 2), alt: "Verdant initiative contributors", caption: "Initiatives rendered as live contributors." },
          { src: IMG.gallery("verdant", 3), alt: "Verdant scope breakdown", caption: "Scope classification behind every number." },
        ],
      },
      {
        id: "outcome",
        label: "Outcome",
        kicker: "Impact",
        kind: "outcome",
        intro: [
          "Teams adopted Verdant as their operating rhythm for sustainability — monthly, not annual. Reporting time went from weeks to minutes.",
          "The continuous ledger made external reporting a by-product of day-to-day tracking rather than a separate project.",
        ],
      },
    ],
    reflection: {
      whatIdChange: [
        "I'd invest in predictive modeling earlier — showing teams 'if you maintain this rate, you'll hit target by Q3' is more actionable than just showing current progress.",
        "The taxonomy was designed for our facilities but should have been abstracted into a configurable schema from day one for other orgs.",
      ],
      whatILearned: [
        "Sustainability data is a reporting problem disguised as a tracking problem. The tracking is easy; making the report a by-product of tracking is the hard part.",
        "When you make a number continuous, people start treating it as an operational metric rather than a compliance checkbox.",
      ],
      keyDecision: [
        "Building the taxonomy before the UI — making mixed-format data fold into one ledger — was the decision that made continuous reporting possible.",
      ],
    },
  },
  {
    slug: "pathao-connect",
    number: "05",
    title: "Pathao Connect",
    description:
      "Formalizing street side bike rides without changing their nature and making them safer.",
    category: "Product Design · Engineering",
    year: "2025",
    role: "Product Design · Engineering",
    status: "Shipped",
    stack: [
      { id: "figma", label: "Figma" },
      { id: "react", label: "React" },
      { id: "typescript", label: "TypeScript" },
    ],
    hero: { src: IMG.hero("pathao-connect"), alt: "Pathao Connect ride flow" },
    thumbnail: { src: IMG.thumb("pathao-connect"), alt: "Pathao Connect project thumbnail" },
    sections: [
      {
        id: "overview",
        label: "Overview",
        kicker: "Project",
        kind: "overview",
        intro: [
          "Pathao Connect brings street-side bike riders into a lightly-structured experience: a rider can publish availability, match with a demand, and complete a fare — without a rigid dispatch model.",
          "The goal was to add safety and trust to an existing informal market, not to replace it with something that forgets how the market actually works.",
        ],
      },
      {
        id: "challenge",
        label: "Challenge",
        kicker: "Framing",
        kind: "challenge",
        intro: [
          "These riders already have a working system: reputation, routes, and fares governed by local knowledge. Imposing a heavy app from above would destroy the very adaptation that makes the market work.",
          "The product challenge was to add a thin trust layer — verified identity, ride record, dispute trail — without taxing the flow.",
        ],
      },
      {
        id: "approach",
        label: "Approach",
        kicker: "Research",
        kind: "approach",
        intro: [
          "We spent field time with riders before touching a wireframe: when they price a ride, how they screen passengers, and where the current system breaks and puts people at risk.",
          "The recurring pattern was asymmetry — riders took the risk of identity, distance, and payment while passengers gave nothing back.",
        ],
      },
      {
        id: "design",
        label: "Design",
        kicker: "Design",
        kind: "design",
        intro: [
          "Connect layers three guarantees onto the existing flow: a verified rider profile, a fare locked before pickup, and a shared trip record that both sides can annotate after the ride.",
          "The interface stays radically simple — a demand list, a confirm button, a fare — because everything else already works.",
        ],
        media: {
          src: IMG.gallery("pathao-connect", 1),
          alt: "Pathao Connect demand list",
          caption: "Three guarantees on the existing flow — identity, locked fare, shared trip record.",
        },
      },
      {
        id: "outcome",
        label: "Outcome",
        kicker: "Impact",
        kind: "outcome",
        intro: [
          "Riders gained a portable reputation outside their local corner, and passengers gained recourse they previously had none of.",
          "Dispute resolution moved from shouting matches to a shared record — the safety gain was measurable in ride quality scores.",
        ],
      },
    ],
    reflection: {
      whatIdChange: [
        "I'd add fare negotiation as a first-class feature — the fixed fare model works for most rides but misses the local knowledge that makes informal pricing work.",
        "The trip record annotation was added late. Making it part of the core flow from day one would have generated richer data for reputation building.",
      ],
      whatILearned: [
        "The best product interventions in informal markets are invisible — the system should feel like it was always there, not imposed from outside.",
        "Trust is built through records, not rules. A shared trip record does more for safety than any set of terms and conditions.",
      ],
      keyDecision: [
        "Adding a thin trust layer — verified identity, locked fare, shared record — without restructuring the existing flow was the constraint that shaped the product.",
      ],
    },
  },
  {
    slug: "parcel-courier-merge",
    number: "06",
    title: "Parcel × Courier Merge",
    description:
      "Merging two delivery services into one address-first flow that routes every order to the right service.",
    category: "Product Design · Engineering",
    year: "2025",
    role: "Product Design · Engineering",
    status: "Shipped",
    stack: [
      { id: "figma", label: "Figma" },
      { id: "react", label: "React" },
      { id: "typescript", label: "TypeScript" },
    ],
    hero: { src: IMG.hero("parcel-courier-merge"), alt: "Parcel × Courier address-first flow" },
    thumbnail: { src: IMG.thumb("parcel-courier-merge"), alt: "Parcel × Courier Merge project thumbnail" },
    sections: [
      {
        id: "overview",
        label: "Overview",
        kicker: "Project",
        kind: "overview",
        intro: [
          "Two delivery services — parcel and courier — were merged into one product. The savings came from routing: one checkout should know whether a shipment is parcel-sized or courier-sized and pick the right service automatically.",
          "The result is an address-first flow: the customer enters where it goes before choosing how, and the platform does the classification.",
        ],
      },
      {
        id: "challenge",
        label: "Challenge",
        kicker: "Framing",
        kind: "challenge",
        intro: [
          "Two separate apps meant two checkouts, two rate tables, and a 50/50 guess for customers about which service they needed. The merge was an engineering decision that customers had to live through.",
          "The UX problem was making the complexity invisible: the customer should never have to know what parcel vs courier means.",
        ],
      },
      {
        id: "approach",
        label: "Approach",
        kicker: "Model",
        kind: "approach",
        intro: [
          "We chose the address as the unit of truth. Everything downstream — service selection, pricing, ETA — derives from the destination and the package's physical dimensions.",
          "Classification happens server-side so the customer sees one seamless rate instead of a menu of services.",
        ],
        bullets: [
          "The address is the unit of truth.",
          "Service, pricing, and ETA all derive from one model.",
          "Classification is server-side — one seamless rate, no menu.",
        ],
      },
      {
        id: "design",
        label: "Design",
        kicker: "Interface",
        kind: "design",
        intro: [
          "The merged flow is a single three-step journey: address, details, review. The service choice is presented as a recommendation with the reasons behind it, not a forced selection.",
          "For repeat customers, a saved profile skips straight to review — the merged product is faster than either original app.",
        ],
        gallery: [
          { src: IMG.gallery("parcel-courier-merge", 1), alt: "Parcel merge address step", caption: "Address-first, before any service choice." },
          { src: IMG.gallery("parcel-courier-merge", 2), alt: "Parcel merge recommendation", caption: "Service as a reasoned recommendation." },
          { src: IMG.gallery("parcel-courier-merge", 3), alt: "Parcel merge review step", caption: "Three steps — address, details, review." },
        ],
      },
      {
        id: "outcome",
        label: "Outcome",
        kicker: "Impact",
        kind: "outcome",
        intro: [
          "Drop-off at the first step of checkout fell as customers stopped being asked to self-serve a decision they didn't want to make.",
          "The routing model removed thousands of missed-classification re-bookings per month — the merge paid for itself in fewer touchpoints.",
        ],
      },
    ],
    reflection: {
      whatIdChange: [
        "I'd add a confidence score to the routing recommendation — showing customers why the system chose a service builds trust and catches edge cases earlier.",
        "The address-as-truth model works for standard addresses but struggles with incomplete or informal location data. I'd invest in address normalisation earlier.",
      ],
      whatILearned: [
        "Mergers are product problems, not just engineering problems. The technical merge was straightforward; making customers feel like they got something better was the real work.",
        "When you remove a decision from the user, you'd better be right — classification accuracy became the most important metric in the system.",
      ],
      keyDecision: [
        "Choosing the address as the unit of truth — and doing classification server-side — meant the customer never had to understand the difference between parcel and courier.",
      ],
    },
  },
];

/* ---------------------------------------------------------------------------
   Registry
   --------------------------------------------------------------------------- */

export function getAllProjects(): readonly Project[] {
  return PROJECTS;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): readonly Project[] {
  return PROJECTS.filter((project) => project.featured);
}

export function getProjectsBySlugs(slugs: readonly string[]): readonly Project[] {
  const bySlug = new Map(PROJECTS.map((project) => [project.slug, project]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((project): project is Project => Boolean(project));
}

export function getNextProject(slug: string): Project {
  const index = PROJECTS.findIndex((project) => project.slug === slug);
  const nextIndex = index === -1 ? 0 : (index + 1) % PROJECTS.length;
  const next = PROJECTS[nextIndex];
  if (!next) {
    throw new Error("Project registry is empty — cannot resolve next project.");
  }
  return next;
}