# @wavix/mcp-server

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

MCP (Model Context Protocol) server for Wavix Telecom API. Provides AI assistants (Claude, GPT, Gemini) with access to SMS, calls, phone numbers, 2FA, analytics, and comprehensive documentation.

## Features

- **36 Tools** - Full API coverage (SMS, Voice, Numbers, 2FA, 10DLC, SIP Trunking, etc.)
- **98 Documentation Resources** - API and product documentation accessible via MCP
- **51 Prompts** - Code integration templates and examples
- **Two Operating Modes** - Setup Mode (no API key) and Full Mode (with API key)
- **Auto-generated** - Tools and types from OpenAPI specification

## Quick Start

### 1. Install

```bash
git clone https://github.com/EvgeniiDurin/wavix-mcp.git
cd wavix-mcp
npm install && npm run build
```

### 2. Configure Your Client

#### Claude Desktop

Add to config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "wavix": {
      "command": "node",
      "args": ["/path/to/wavix-mcp/build/index.js"],
      "env": {
        "WAVIX_API_KEY": "wvx_live_your_api_key_here"
      }
    }
  }
}
```

#### Claude Code (CLI)

```bash
# With API key (Full Mode)
claude mcp add wavix -s user -e WAVIX_API_KEY=wvx_live_your_api_key_here -- node /path/to/wavix-mcp/build/index.js

# Without API key (Setup Mode)
claude mcp add wavix -s user -- node /path/to/wavix-mcp/build/index.js

# Verify
claude mcp list
```

#### Cursor IDE

1. Open Cursor Settings (`Cmd+Shift+J` on macOS / `Ctrl+Shift+J` on Windows/Linux) → **Tools & MCP**
2. Click **Add new MCP server** (opens JSON editor)
3. Add this configuration:

```json
{
  "mcpServers": {
    "wavix": {
      "command": "node",
      "args": ["/path/to/wavix-mcp/build/index.js"],
      "env": {
        "WAVIX_API_KEY": "wvx_live_your_api_key_here"
      }
    }
  }
}
```

> **No API key?** Remove the `env` block to use Setup Mode (documentation and code generation only).

### 3. Try it!

**Setup Mode (no API key):**
- "How do I integrate Wavix SMS into my Node.js app?"
- "What do I need to send SMS to US numbers?"

**Full Mode (with API key):**
- "Check my account balance"
- "Send SMS to +15551234567: Hello!"

## Operating Modes

| Mode | API Key | Features |
|------|---------|----------|
| **Setup Mode** | Not required | Documentation (98 files), prompts (51), code generation, examples |
| **Full Mode** | Required | All Setup Mode features + 36 API tools for real operations |

## Available Tools

36 tools organized by category:

| Category | Count | Examples |
|----------|-------|----------|
| API Tools | 22 | `sms`, `calls`, `numbers`, `10dlc_brands`, `sip_trunks`, `billing` |
| Smart Tools | 3 | `wavix_assistant`, `quick_check`, `send_message` |
| Integration | 3 | `integration_example`, `endpoint_info`, `list_endpoints` |
| Troubleshooting | 5 | `troubleshoot`, `diagnose_error`, `explain` |
| Workflow | 3 | `get_recipe`, `list_recipes`, `get_recipe_step` |

> API tools are grouped by resource (e.g., `sms` tool handles send, list, get actions). See [full documentation](https://docs.wavix.com/) for details.

## Resources & Prompts

- **98 Documentation Resources** (`wavix://api/...`, `wavix://product/...`) - API reference, guides, error codes
- **51 Prompts** - `wavix-integrate`, `wavix-webhook-setup`, `send_sms`, `call_start`, etc.

## Examples

**Code generation (Setup Mode):**
```
User: "Generate Node.js code to send SMS with error handling"
AI: [Uses integration_example tool] → Complete working code with retry logic
```

**Real operations (Full Mode):**
```
User: "Send SMS to +15551234567: Hello!"
AI: [Uses send_message tool] → "SMS sent! Message ID: msg-abc123"

User: "Am I ready to send SMS to US numbers?"
AI: [Uses quick_check tool] → Shows 10DLC registration status and next steps
```

## Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WAVIX_API_KEY` | Optional | - | Required for Full Mode |
| `WAVIX_API_URL` | No | `https://api.wavix.com` | API endpoint |
| `LOG_LEVEL` | No | `info` | `debug`, `info`, `warn`, `error` |

**Get API Key:** [wavix.com](https://wavix.com) → [API Keys](https://wavix.com/api-keys) → Create key (starts with `wvx_`)

## Troubleshooting

**MCP server not detected:**
```bash
claude mcp list                    # Check if added
claude mcp add wavix -s user -- node /path/to/wavix-mcp/build/index.js  # Re-add
```

**Server not starting:**
- Requires Node.js >= 20.0.0 (`node --version`)
- Check console for error messages

## Links

- [GitHub Repository](https://github.com/EvgeniiDurin/wavix-mcp)
- [Wavix API Documentation](https://docs.wavix.com/)
- [Get API Key](https://wavix.com/api-keys)

## License

MIT
