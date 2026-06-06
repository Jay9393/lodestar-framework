import { hasArtifact, hasArtifactRecursive, type Stage } from "./project.js";

export interface GateItem {
  id: string;
  description: string;
  /** Automated check against the filesystem, or null if it needs human/agent judgment. */
  auto: ((root: string) => boolean) | null;
}

export interface GateResult {
  from: Stage;
  to: Stage | "(done)";
  items: { id: string; description: string; status: "pass" | "fail" | "manual" }[];
  autoPassed: boolean;
}

const PRD_RE = /^PRD-\d+.*\.md$/;
const US_RE = /^US-\d+.*\.md$/;
// Any markdown artifact that isn't the seeded folder README (so gates aren't
// trivially satisfied by the scaffold's README templates).
const DOC_RE = /^(?!README\.md$).+\.md$/i;
// A real tech spec: not the README and not the seeded context-map.md.
const TECH_SPEC_RE = /^(?!README\.md$)(?!context-map\.md$).+\.md$/i;

/** Checklist to ENTER the stage that follows `from`. */
const GATES: Record<Stage, { to: Stage | "(done)"; items: GateItem[] }> = {
  discovery: {
    to: "design",
    items: [
      { id: "biz", description: "Business strategy doc exists (market/customer/problem/goal).", auto: (r) => hasArtifact(r, "docs/1-discovery/00-business-strategy", DOC_RE) },
      { id: "strategy", description: "Product strategy fixes core problem, target, positioning, metrics.", auto: (r) => hasArtifact(r, "docs/1-discovery/01-product-strategy", DOC_RE) },
      { id: "plan", description: "Product plan fixes scope, priority, launch hypotheses.", auto: (r) => hasArtifact(r, "docs/1-discovery/02-product-plan", DOC_RE) },
      { id: "prd", description: "At least one PRD exists with 8 sections + verifiable ACs.", auto: (r) => hasArtifact(r, "docs/1-discovery/03-prd", PRD_RE) },
      { id: "us", description: "User stories (grouped by business domain) are testable units with ACs.", auto: (r) => hasArtifactRecursive(r, "docs/1-discovery/04-user-stories", US_RE) },
      { id: "domain-map", description: "A rough business-domain map exists in 04-user-stories/README.md.", auto: null },
    ],
  },
  design: {
    to: "build",
    items: [
      { id: "context-map", description: "Context map maps business domains to technical contexts.", auto: (r) => hasArtifact(r, "docs/2-design/tech", /^context-map\.md$/) },
      { id: "tech", description: "Tech specs cover every active user story (business domain or shared/).", auto: (r) => hasArtifactRecursive(r, "docs/2-design/tech", TECH_SPEC_RE) },
      { id: "design", description: "Design specs cover every active user story.", auto: (r) => hasArtifactRecursive(r, "docs/2-design/design", DOC_RE) },
      { id: "coverage", description: "No active US is left without a corresponding spec.", auto: null },
    ],
  },
  build: {
    to: "operate",
    items: [
      { id: "tasks", description: "Tasks trace to user stories (parent = US).", auto: (r) => hasArtifact(r, "docs/3-build/tasks", /^TASK-\d+.*\.md$/) },
      { id: "ac", description: "Acceptance criteria met and tests pass.", auto: null },
      { id: "deployable", description: "Change is deployable.", auto: null },
    ],
  },
  operate: {
    to: "(done)",
    items: [
      { id: "metrics", description: "Success metrics implemented as event schema / dashboards.", auto: (r) => hasArtifact(r, "docs/4-operate/metrics", DOC_RE) },
      { id: "runbooks", description: "Runbooks exist.", auto: (r) => hasArtifact(r, "docs/4-operate/runbooks", DOC_RE) },
      { id: "incidents", description: "Incident process defined.", auto: null },
    ],
  },
};

export function checkGate(root: string, from: Stage): GateResult {
  const gate = GATES[from];
  const items = gate.items.map((it) => {
    if (it.auto === null) return { id: it.id, description: it.description, status: "manual" as const };
    return {
      id: it.id,
      description: it.description,
      status: it.auto(root) ? ("pass" as const) : ("fail" as const),
    };
  });
  return {
    from,
    to: gate.to,
    items,
    autoPassed: items.every((i) => i.status !== "fail"),
  };
}
