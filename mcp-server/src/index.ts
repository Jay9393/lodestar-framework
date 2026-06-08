#!/usr/bin/env node
/**
 * lodestar-mcp — MCP server that enforces the Lodestar framework.
 *
 * Tools (model-agnostic; any MCP-capable agent can call them):
 *   get_stage        current lifecycle stage + mode
 *   get_north_star   the pinned top-level goal (anti-drift injection)
 *   check_gate       run the next-stage checklist; pass/fail/manual per item
 *   check_alignment  return north star + an artifact for the agent to judge drift
 *   log_decision     record a gate-skip / decision under 99-decision-research
 *
 * Project root: walks up from cwd to find PROJECT.md, or set LODESTAR_PROJECT_ROOT.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { existsSync, readFileSync } from "node:fs";
import { resolve, sep } from "node:path";
import { loadManifest, writeDecision, type Stage } from "./project.js";

/** Resolve a user-supplied path and reject anything outside the project root. */
function resolveInRoot(root: string, p: string): string {
  const base = resolve(root);
  const full = resolve(base, p);
  if (full !== base && !full.startsWith(base + sep)) {
    throw new Error(`path escapes project root: ${p}`);
  }
  return full;
}
import { checkGate } from "./gates.js";

const server = new McpServer({ name: "lodestar-mcp", version: "0.1.0" });

const text = (obj: unknown) => ({
  content: [{ type: "text" as const, text: typeof obj === "string" ? obj : JSON.stringify(obj, null, 2) }],
});

server.tool(
  "get_stage",
  "Return the project's current lifecycle stage and gate mode from PROJECT.md.",
  {},
  async () => {
    const m = loadManifest();
    return text({ project: m.project, stage: m.stage, mode: m.mode, root: m.root });
  }
);

server.tool(
  "get_north_star",
  "Return the pinned top-level goal. Read this before any work and keep it in view to avoid drift.",
  {},
  async () => {
    const m = loadManifest();
    return text(m.northStar || "(North Star not yet defined in PROJECT.md)");
  }
);

server.tool(
  "check_gate",
  "Run the checklist required to enter the stage following the current (or given) stage.",
  { from: z.enum(["discovery", "design", "build", "operate"]).optional().describe("Stage to check the exit gate for. Defaults to the current stage.") },
  async ({ from }) => {
    const m = loadManifest();
    const stage = (from as Stage) ?? m.stage;
    const result = checkGate(m.root, stage);
    const failed = result.items.filter((i) => i.status === "fail");
    const manual = result.items.filter((i) => i.status === "manual").length;
    let verdict: string;
    if (result.userChallengeOpen) {
      verdict = `BLOCKED: an unresolved User-Challenge decision exists. Present the options and ask the human — this cannot be bypassed by mode. Mark it resolved once decided.`;
    } else if (failed.length === 0) {
      verdict = `Gate clear (auto-checks). ${manual} manual item(s) need confirmation.`;
    } else if (m.mode === "strict") {
      verdict = `BLOCKED (strict mode): ${failed.length} unmet item(s). Satisfy them or waive explicitly.`;
    } else {
      verdict = `WARN (lite mode): ${failed.length} unmet item(s). You may proceed only with a logged reason via log_decision.`;
    }
    return text({ ...result, mode: m.mode, verdict });
  }
);

server.tool(
  "check_alignment",
  "Return the north star alongside an artifact so the agent can judge whether the artifact drifts from the top-level goal.",
  {
    artifact_path: z.string().optional().describe("Path (relative to project root) of the artifact to check."),
    artifact_text: z.string().optional().describe("Inline artifact text, if not on disk yet."),
  },
  async ({ artifact_path, artifact_text }) => {
    const m = loadManifest();
    let artifact = artifact_text ?? "";
    if (!artifact && artifact_path) {
      const full = resolveInRoot(m.root, artifact_path);
      artifact = existsSync(full) ? readFileSync(full, "utf8") : `(file not found: ${artifact_path})`;
    }
    return text({
      northStar: m.northStar || "(undefined)",
      artifact,
      instruction:
        "Judge whether the artifact still serves the north star. Respond with: aligned (yes/no/partial), the specific drift if any, and a concrete correction. If drift is found, surface it to the user rather than proceeding silently.",
    });
  }
);

server.tool(
  "log_decision",
  "Record a decision (with its class) under docs/99-decision-research/gate-skips/. Use for gate-skips, Taste choices, and User-Challenge escalations.",
  {
    title: z.string().min(1).describe("Short title of the decision."),
    reason: z.string().min(1).describe("Why the decision was made / the gate was skipped, and the risk accepted."),
    decision_class: z.enum(["mechanical", "taste", "user-challenge"]).describe("mechanical = obvious; taste = defensible default; user-challenge = scope/cost/north-star/hard-to-reverse, needs the human."),
    resolved: z.boolean().default(false).describe("Whether the decision is settled. An unresolved user-challenge hard-blocks the gate."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD").describe("ISO date YYYY-MM-DD (the agent supplies this)."),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case [a-z0-9-]").describe("kebab-case slug for the filename."),
  },
  async ({ title, reason, decision_class, resolved, date, slug }) => {
    const m = loadManifest();
    const file = writeDecision(m.root, slug, title, reason, date, decision_class, resolved);
    const note =
      decision_class === "user-challenge" && !resolved
        ? "This is an UNRESOLVED user-challenge — it blocks the gate until a human decides. Present options and ask; then re-log with resolved=true."
        : "Also add a one-line entry under '## Active gate-skips' or '## Gate Reports' in PROJECT.md.";
    return text({ written: file, note });
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
