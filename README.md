# @wavix/mcp-server

MCP (Model Context Protocol) server for Wavix Telecom API. Provides AI assistants (Claude, GPT) with access to SMS, calls, phone numbers, 2FA, and analytics.

## Installation

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "wavix": {
      "command": "npx",
      "args": ["@wavix/mcp-server"],
      "env": {
        "WAVIX_API_KEY": "wvx_live_your_api_key_here"
      }
    }
  }
}
```

### Programmatic Usage

```bash
npm install @wavix/mcp-server
```

```javascript
import { WavixMcpServer } from "@wavix/mcp-server"

const server = new WavixMcpServer({
  name: "wavix-mcp",
  version: "1.0.0"
})

await server.start()
```

## Available Tools

### SMS
- `sms_send` - Send SMS/MMS message
- `sms_list` - List sent messages
- `sms_get` - Get message details

### Calls
- `call_start` - Initiate outbound call
- `cdr_list` - List call records
- `cdr_get` - Get call details

### Phone Numbers
- `numbers_list` - List phone numbers
- `numbers_get` - Get number details

### 2FA
- `twofa_send` - Send verification code
- `twofa_verify` - Verify code

### Account
- `account_profile` - Get account info
- `account_balance` - Get balance

## Configuration

| Environment Variable | Required | Default | Description |
|---------------------|----------|---------|-------------|
| `WAVIX_API_KEY` | Yes | - | Wavix API key |
| `WAVIX_API_URL` | No | `https://api.wavix.com/v2` | API endpoint |
| `LOG_LEVEL` | No | `info` | Logging level |

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# Build
pnpm build

# Test
pnpm test

# Lint
pnpm lint

# Type check
pnpm type

# Sync OpenAPI spec and generate types
pnpm sync:openapi
pnpm generate:tools
```

## Architecture

```
src/
├── index.ts          # Entry point
├── server.ts         # MCP server setup
├── config/           # Joi configuration
├── api/
│   ├── client.ts     # HTTP client (fetch)
│   └── types.ts      # Generated from OpenAPI
├── tools/
│   ├── generated/    # Auto-generated tools
│   └── handlers/     # Tool handlers
├── helpers/          # Logger, masking, validation
├── resources/        # MCP resources
└── prompts/          # MCP prompts
```

## License

MIT
