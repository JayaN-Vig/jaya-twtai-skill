# doc-skills plugin

The one plugin in the `twtai` marketplace. It bundles every plugin component type so you can see how each one is declared.

## What's inside

| Component | File | Invoked as |
|-----------|------|------------|
| **Command** | `commands/check-style.md` | `/doc-skills:check-style <file>` |
| **Command** | `commands/release-notes.md` | `/doc-skills:release-notes <source>` |
| **Skill** | `skills/doc-coverage/SKILL.md` | auto-invoked when you ask "what's missing in this doc?" |
| **Agent** | `agents/doc-auditor.md` | delegated for whole-folder audits |
| **Hook** | `hooks/hooks.json` | runs after `Write`/`Edit` to nudge a style check |
| **MCP servers** | `.mcp.json` | two **remote** servers, connected automatically |

## The bundled MCP servers (remote, no setup)

Because the plugin's `.mcp.json` lists them, enabling this plugin connects you to two **safe, read-only, no-auth** online MCP servers:

- **deepwiki** → `https://mcp.deepwiki.com/mcp` — ask questions about any public GitHub repo's docs.
- **claude-code-docs** → `https://code.claude.com/docs/mcp` — search the official Claude Code docs.

Tool names are namespaced as `mcp__plugin_doc-skills_deepwiki__ask_question`, etc. Run `/reload-plugins` if you toggle the plugin mid-session.

## Component vs. component — quick guide

- **Command** = a reusable prompt you run on demand (`/name`). Best for review/generation tasks.
- **Skill** = like a command but has a `description` in its frontmatter, so Claude can also *auto-invoke* it when relevant.
- **Agent** = an isolated subagent with its own prompt, tools, and model — for multi-step jobs you delegate.
- **MCP server** = gives Claude real *tools* (functions/data), local or remote.

## Layout

```
doc-skills/
├── .claude-plugin/plugin.json
├── commands/
│   ├── check-style.md
│   └── release-notes.md
├── skills/
│   └── doc-coverage/SKILL.md
├── agents/
│   └── doc-auditor.md
├── hooks/
│   └── hooks.json
└── .mcp.json
```

> Only `plugin.json` lives in `.claude-plugin/`. Everything else sits at the plugin root, where Claude Code auto-discovers it.
