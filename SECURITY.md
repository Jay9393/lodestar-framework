# Security Policy

## Scope

`lodestar-mcp` is a **local developer tool** invoked by a coding agent on a
developer's machine. Its remote attack surface is low, but because it reads and
writes files based on inputs, it defends against:

- **Path traversal** — `check_alignment` resolves `artifact_path` and rejects any
  path that escapes the project root.
- **Filename injection** — `log_decision` validates `date` (`YYYY-MM-DD`) and
  `slug` (kebab-case) before writing.

## Reporting a vulnerability

Please open a private security advisory on the GitHub repository, or email the
maintainer. Do not file public issues for sensitive reports.

We aim to acknowledge reports within a few days.
