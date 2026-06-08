import { existsSync, readFileSync, mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parse as parseYaml } from "yaml";

export type Stage = "discovery" | "design" | "build" | "operate";
export type Mode = "strict" | "lite";

export interface Manifest {
  root: string;
  project: string;
  stage: Stage;
  mode: Mode;
  northStar: string;
  raw: string;
}

/**
 * Find the project root by walking up from `start` until a PROJECT.md is found.
 * Honors LODESTAR_PROJECT_ROOT if set.
 */
export function findProjectRoot(start: string = process.cwd()): string {
  const override = process.env.LODESTAR_PROJECT_ROOT;
  if (override) return resolve(override);

  let dir = resolve(start);
  while (true) {
    if (existsSync(join(dir, "PROJECT.md"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  throw new Error(
    "No PROJECT.md found. Run scaffold.sh first, or set LODESTAR_PROJECT_ROOT."
  );
}

/** Extract the YAML frontmatter block and the markdown body. */
function splitFrontmatter(text: string): { fm: Record<string, unknown>; body: string } {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { fm: {}, body: text };
  return { fm: (parseYaml(match[1]) ?? {}) as Record<string, unknown>, body: match[2] };
}

/** Read a `## Heading` section's body from a markdown string. */
export function readSection(body: string, heading: string): string {
  // Escape regex metacharacters in the heading. Terminate at the next `## `
  // heading or the end of the string ($ without the `m` flag = end of input),
  // so the LAST section is captured too.
  const h = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?:^|\\n)##\\s+${h}\\s*\\n([\\s\\S]*?)(?=\\n##\\s|$)`);
  const m = body.match(re);
  return m ? m[1].trim() : "";
}

export function loadManifest(start?: string): Manifest {
  const root = findProjectRoot(start);
  const raw = readFileSync(join(root, "PROJECT.md"), "utf8");
  const { fm, body } = splitFrontmatter(raw);
  return {
    root,
    project: String(fm.project ?? "unknown"),
    stage: (fm.stage as Stage) ?? "discovery",
    mode: (fm.mode as Mode) ?? "lite",
    northStar: readSection(body, "North Star"),
    raw,
  };
}

/** True if `dir` (relative to root) directly contains a file matching `pattern`. */
export function hasArtifact(root: string, dir: string, pattern: RegExp): boolean {
  const full = join(root, dir);
  if (!existsSync(full)) return false;
  return readdirSync(full).some((f) => pattern.test(f));
}

/** True if `dir` or any nested subfolder contains a file matching `pattern`. */
export function hasArtifactRecursive(root: string, dir: string, pattern: RegExp): boolean {
  const start = join(root, dir);
  if (!existsSync(start)) return false;
  const stack = [start];
  while (stack.length) {
    const d = stack.pop()!;
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) stack.push(join(d, e.name));
      else if (pattern.test(e.name)) return true;
    }
  }
  return false;
}

export type DecisionClass = "mechanical" | "taste" | "user-challenge";

/** Append a decision record (with its class) under 99-decision-research/gate-skips/. */
export function writeDecision(
  root: string,
  slug: string,
  title: string,
  reason: string,
  date: string,
  decisionClass: DecisionClass,
  resolved: boolean
): string {
  const dir = join(root, "docs/99-decision-research/gate-skips");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${date}-${slug}.md`);
  const content =
    `---\nclass: ${decisionClass}\nresolved: ${resolved}\ndate: ${date}\n---\n\n` +
    `# Decision: ${title}\n\n## Reason / Risk accepted\n\n${reason}\n`;
  writeFileSync(file, content, "utf8");
  return file;
}

/** Count decision records that are class=user-challenge and resolved=false. */
export function countOpenUserChallenges(root: string): number {
  const dir = join(root, "docs/99-decision-research/gate-skips");
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".md")) continue;
    const t = readFileSync(join(dir, f), "utf8");
    if (/(^|\n)class:\s*user-challenge\b/.test(t) && /(^|\n)resolved:\s*false\b/.test(t)) n++;
  }
  return n;
}

/** True if PROJECT.md contains a `### GATE: <from>→<to>` (or `->`) report block. */
export function hasGateReport(root: string, from: string, to: string): boolean {
  const p = join(root, "PROJECT.md");
  if (!existsSync(p)) return false;
  // Strip HTML comments so the seeded template example doesn't count as a report.
  const text = readFileSync(p, "utf8").replace(/<!--[\s\S]*?-->/g, "");
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^#{2,3}\\s*GATE:\\s*${esc(from)}\\s*(?:→|->)\\s*${esc(to)}\\b`, "mi");
  return re.test(text);
}
