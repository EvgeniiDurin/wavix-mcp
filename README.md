# @wavix/mcp-server

![npm version](https://img.shields.io/npm/v/@wavix/mcp-server)
![license](https://img.shields.io/npm/l/@wavix/mcp-server)
![node version](https://img.shields.io/node/v/@wavix/mcp-server)

MCP (Model Context Protocol) server for Wavix Telecom API. Provides AI assistants (Claude, GPT, Gemini) with access to SMS, calls, phone numbers, 2FA, analytics, and comprehensive documentation.

## Features

- **78 Tools** - Full API coverage (SMS, Voice, Numbers, 2FA, 10DLC, SIP Trunking, etc.)
- **103 Documentation Resources** - API and product documentation accessible via MCP
- **57 Prompts** - Code integration templates and examples
- **Two Operating Modes** - Setup Mode (no API key) and Full Mode (with API key)
- **Auto-generated** - Tools and types from OpenAPI specification

## Quick Start

### 1. Install

```bash
git clone https://github.com/evgeniidurin-ai/mcp-wavix.git
cd mcp-wavix/mcp-server
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
      "args": ["/path/to/mcp-wavix/mcp-server/build/index.js"],
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
claude mcp add wavix -s user -e WAVIX_API_KEY=wvx_live_your_api_key_here -- node /path/to/mcp-wavix/mcp-server/build/index.js

# Without API key (Setup Mode)
claude mcp add wavix -s user -- node /path/to/mcp-wavix/mcp-server/build/index.js

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
      "args": ["/path/to/mcp-wavix/mcp-server/build/index.js"],
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
| **Setup Mode** | Not required | Documentation (103 files), prompts (57), code generation, examples |
| **Full Mode** | Required | All Setup Mode features + 78 API tools for real operations |

## Available Tools

78 tools organized by category:

| Category | Tools | Examples |
|----------|-------|----------|
| SMS and MMS | 9 | `sms_send`, `sms_list`, `sms_get` |
| Call Control | 9 | `call_create`, `call_hangup`, `call_stream_start` |
| Phone Numbers | 7 | `numbers_list`, `number_get`, `mydids_update` |
| 2FA | 6 | `two_fa_verification_create`, `two_fa_verification_check_create` |
| 10DLC | 28 | `tcr_brand_create`, `10dlc_brands_campaigns_create` |
| CDRs & Recordings | 9 | `cdr_list`, `cdr_get`, `recordings_list` |
| SIP Trunking | 5 | `sip_trunk_create`, `sip_trunk_get` |
| Number Buying | 5 | `buy_countries_list`, `buy_numbers_available` |
| Billing | 3 | `billing_transactions_list`, `billing_invoices_list` |
| Other | 7 | Webhooks, Speech Analytics, Voice Campaigns, etc. |

> See [full API documentation](https://wavix.com/docs) for complete reference.

## Resources & Prompts

- **103 Documentation Resources** (`wavix://api/...`, `wavix://product/...`) - API reference, guides, error codes
- **57 Prompts** - `wavix-integrate`, `wavix-webhook-setup`, `send_sms`, `call_start`, etc.

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
claude mcp add wavix -s user -- node /path/to/build/index.js  # Re-add
```

**Server not starting:**
- Requires Node.js >= 20.0.0 (`node --version`)
- Check console for error messages

## Links

- [GitHub Repository](https://github.com/evgeniidurin-ai/mcp-wavix)
- [Wavix API Documentation](https://docs.wavix.com/)
- [Get API Key](https://wavix.com/api-keys)

## License

MIT
