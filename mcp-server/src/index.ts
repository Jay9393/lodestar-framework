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
import { join } from "node:path";
import { loadManifest, writeGateSkip, type Stage } from "./project.js";
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
    return text({
      ...result,
      mode: m.mode,
      verdict:
        failed.length === 0
          ? `Gate clear (auto-checks). ${result.items.filter((i) => i.status === "manual").length} manual item(s) need confirmation.`
          : m.mode === "strict"
            ? `BLOCKED (strict mode): ${failed.length} unmet item(s). Satisfy them or waive explicitly.`
            : `WARN (lite mode): ${failed.length} unmet item(s). You may proceed only with a logged reason via log_decision.`,
    });
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
      const full = join(m.root, artifact_path);
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
  "Record a gate-skip or notable decision under docs/99-decision-research/gate-skips/.",
  {
    title: z.string().describe("Short title of the decision/skip."),
    reason: z.string().describe("Why the gate was skipped or the decision was made, and the risk accepted."),
    date: z.string().describe("ISO date YYYY-MM-DD (the agent supplies this)."),
    slug: z.string().describe("kebab-case slug for the filename."),
  },
  async ({ title, reason, date, slug }) => {
    const m = loadManifest();
    const file = writeGateSkip(m.root, slug, title, reason, date);
    return text({ written: file, note: "Also add a one-line entry under '## Active gate-skips' in PROJECT.md." });
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
