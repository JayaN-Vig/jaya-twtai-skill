# Connecting to an online (remote) MCP server

You don't have to build or run an MCP server to use one. Many are **hosted online** — you just point Claude Code at a URL. This folder shows how, using two servers that are **safe for training: no login, no API key, read-only.**

## The two servers used here

| Server | URL | Auth | Read-only | What it gives you |
|--------|-----|------|-----------|-------------------|
| **DeepWiki** (Cognition/Devin) | `https://mcp.deepwiki.com/mcp` | None | Yes | Ask questions about any **public GitHub repo's** docs. Tools: `read_wiki_structure`, `read_wiki_contents`, `ask_question` |
| **Claude Code Docs** (Anthropic) | `https://code.claude.com/docs/mcp` | None | Yes | Full-text search over the official Claude Code documentation |

Both are read-only and need no credentials — ideal for a classroom of 30+.

## Option A — add it with one command (per user)

```bash
# Streamable HTTP transport
claude mcp add --transport http deepwiki https://mcp.deepwiki.com/mcp
claude mcp add --transport http claude-code-docs https://code.claude.com/docs/mcp
```

Add `--scope user` to make it available in all your projects, or `--scope project` to share it with your team via a committed `.mcp.json`.

## Option B — share it via a project file (whole team)

Copy the `.mcp.json` in this folder to the **root of your project**. Anyone who opens the project in Claude Code is prompted to enable the servers. That file is exactly:

```json
{
  "mcpServers": {
    "deepwiki":         { "type": "http", "url": "https://mcp.deepwiki.com/mcp" },
    "claude-code-docs": { "type": "http", "url": "https://code.claude.com/docs/mcp" }
  }
}
```

> `"type": "http"` is the modern *streamable HTTP* transport. (`"type": "sse"` also exists but is deprecated.) For servers that need a token, add a `"headers": { "Authorization": "Bearer ..." }` block.

## Try it

Once connected, just ask in plain language — Claude will call the server's tools:

```
Using DeepWiki, what is the high-level architecture of the modelcontextprotocol/servers repo?
```
```
Search the Claude Code docs: how do I add a project-scoped MCP server?
```

## How this differs from the bundled plugin

The `doc-skills` plugin in this repo already declares these same two servers in its `.mcp.json`, so **installing the plugin connects you automatically** — no extra steps. This folder is the manual equivalent, for when you want MCP without a plugin.
