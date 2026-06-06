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
  const re = new RegExp(`^##\\s+${heading}\\s*$([\\s\\S]*?)(?=^##\\s|\\Z)`, "m");
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

/** True if `dir` (relative to root) contains at least one file matching `pattern`. */
export function hasArtifact(root: string, dir: string, pattern: RegExp): boolean {
  const full = join(root, dir);
  if (!existsSync(full)) return false;
  return readdirSync(full).some((f) => pattern.test(f));
}

/** Append a decision/gate-skip record under 99-decision-research/gate-skips/. */
export function writeGateSkip(
  root: string,
  slug: string,
  title: string,
  reason: string,
  date: string
): string {
  const dir = join(root, "docs/99-decision-research/gate-skips");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${date}-${slug}.md`);
  const content = `# Gate skip: ${title}\n\n- date: ${date}\n\n## Reason\n\n${reason}\n`;
  writeFileSync(file, content, "utf8");
  return file;
}
