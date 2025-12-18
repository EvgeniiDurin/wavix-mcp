# @wavix/mcp-server

![npm version](https://img.shields.io/npm/v/@wavix/mcp-server)
![license](https://img.shields.io/npm/l/@wavix/mcp-server)
![node version](https://img.shields.io/node/v/@wavix/mcp-server)

MCP (Model Context Protocol) server for Wavix Telecom API. Provides AI assistants (Claude, GPT, Gemini) with access to SMS, calls, phone numbers, 2FA, analytics, and comprehensive documentation.

## Features

- ✅ **123+ Tools** - Full API coverage (SMS, Voice, Numbers, 2FA, 10DLC, SIP Trunking, etc.)
- ✅ **97 Documentation Resources** - API and product documentation accessible via MCP
- ✅ **31 Prompts** - Code integration templates and examples
- ✅ **Two Operating Modes** - Documentation Mode (no API key) and Full Mode (with API key)
- ✅ **Auto-generated** - Tools and types from OpenAPI specification
- ✅ **Type-safe** - Full TypeScript support with generated types
- ✅ **OpenAPI-first** - Single source of truth for API definitions

## Quick Start

### 1. Install

```bash
npm install -g @wavix/mcp-server
```

Or use with npx (no installation needed):
```bash
npx @wavix/mcp-server
```

### 2. Configure Your Client

Choose your MCP client:

#### Claude Desktop

Add to your Claude Desktop config:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

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

#### Claude Code (CLI)

Add MCP server via CLI command:

```bash
# With API key (Full Mode)
claude mcp add wavix -s user -e WAVIX_API_KEY=wvx_live_your_api_key_here -- npx @wavix/mcp-server

# Without API key (Documentation Mode)
claude mcp add wavix -s user -- npx @wavix/mcp-server
```

Verify installation:
```bash
claude mcp list
```

> **Scope options:** `-s user` (all projects) or `-s project` (current project only)

#### Cursor IDE

Create or edit Cursor MCP config file:

**macOS:** `~/Library/Application Support/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`
**Windows:** `%APPDATA%\Cursor\User\globalStorage\rooveterinaryinc.roo-cline\settings\cline_mcp_settings.json`
**Linux:** `~/.config/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`

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

> **No API key?** Remove the `env` block. You can still ask questions and get code examples.

### 3. Try it!

**Without API key (Documentation Mode):**
- "Show me Wavix SMS documentation"
- "Generate code to send SMS in Python"
- "How do I set up webhooks for SMS?"

**With API key (Full Mode):**
- "Send SMS to +15551234567: Hello from Claude!"
- "Check my account balance"
- "List my phone numbers"

## Operating Modes

### Documentation Mode (No API Key)

Works without API key - provides:
- ✅ Documentation resources (97 files)
- ✅ Code integration prompts (31 prompts)
- ✅ Examples and guides
- ❌ API tools (disabled)

**Perfect for:**
- Integration
- Getting call and SMS reports

### Full Mode (With API Key)

With `WAVIX_API_KEY` set, you get:
- ✅ All Documentation Mode features
- ✅ 123+ API tools (send SMS, make calls, etc.)
- ✅ Full API access

**Perfect for:**
- Production use
- Real API operations
- Complete integration

## Installation

### Claude Code (CLI) - Recommended

The simplest way to add Wavix MCP server:

```bash
# With API key (Full Mode - all tools enabled)
claude mcp add wavix -s user -e WAVIX_API_KEY=wvx_live_your_api_key_here -- npx @wavix/mcp-server

# Without API key (Documentation Mode - docs and prompts only)
claude mcp add wavix -s user -- npx @wavix/mcp-server
```

**Scope options:**
- `-s user` - Available in all projects (stored in `~/.claude.json`)
- `-s project` - Current project only (stored in `.mcp.json`)

**Verify and manage:**
```bash
claude mcp list              # List all MCP servers
claude mcp get wavix         # Get server details
claude mcp remove wavix      # Remove server
```

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

> **No API key?** Remove the `env` block. You can still ask questions and get code examples.

### Cursor IDE

Create or edit Cursor MCP config file:

**macOS:** `~/Library/Application Support/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`  
**Windows:** `%APPDATA%\Cursor\User\globalStorage\rooveterinaryinc.roo-cline\settings\cline_mcp_settings.json`  
**Linux:** `~/.config/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`

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

> **Note:** Cursor uses Cline extension for MCP. Config file location may vary by Cursor version. Restart Cursor after editing.

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

123+ tools organized by category:

### SMS and MMS (9 tools)
- `sms_send` - Send SMS/MMS message
- `sms_list` - List sent messages
- `sms_get` - Get message details
- `sms_list_all` - List all messages
- `sms_sender_ids_list` - List registered sender IDs
- `sms_sender_id_create` - Register sender ID
- `sms_sender_id_get` - Get sender ID details
- `sms_sender_id_delete` - Delete sender ID
- `sms_opt_out_add` - Add number to opt-out list

### Call Control (9 tools)
- `call_create` - Initiate outbound call
- `calls_list` - List calls
- `call_get` - Get call details
- `call_hangup` - End call
- `call_answer` - Answer incoming call
- `call_stream_start` - Start call streaming
- `call_stream_stop` - Stop call streaming
- `call_play` - Play audio in call
- `call_dtmf_collect` - Collect DTMF tones

### Phone Numbers (7 tools)
- `numbers_list` - List owned numbers
- `number_get` - Get number details
- `mydids_update` - Update number configuration
- `numbers_sms_update` - Update SMS settings
- `numbers_bulk_delete` - Delete multiple numbers
- `mydids_update_destinations_create` - Configure call routing
- `numbers_papers_upload` - Upload porting documents

### 2FA (6 tools)
- `two_fa_verification_create` - Send verification code
- `two_fa_verification_check_create` - Verify code
- `two_fa_verification_cancel_patch` - Cancel verification
- `two_fa_service_sessions_get` - Get session details
- `two_fa_session_events_get` - Get session events
- `two_fa_verification_create_create` - Alternative verification method

### 10DLC (28 tools)
- `tcr_brand_create` - Register 10DLC brand
- `tcr_brand_get` - Get brand details
- `tcr_brand_update` - Update brand
- `tcr_brand_delete` - Delete brand
- `tcr_brands_list` - List brands
- `tcr_brand_appeal_create` - Appeal brand rejection
- `tcr_brand_appeals_list` - List appeals
- `tcr_evidence_upload` - Upload verification evidence
- `tcr_evidence_list` - List evidence
- `tcr_evidence_get` - Get evidence details
- `tcr_evidence_delete` - Delete evidence
- `tcr_vetting_create` - Create vetting request
- `tcr_vettings_list` - List vettings
- `tcr_vetting_appeal_create` - Appeal vetting
- `tcr_usecase_get` - Get use case details
- `10dlc_brands_campaigns_create` - Create campaign
- `10dlc_brands_campaigns_list` - List campaigns
- `10dlc_brands_campaigns_get` - Get campaign details
- `10dlc_brands_campaigns_update` - Update campaign
- `10dlc_brands_campaigns_delete` - Delete campaign
- `10dlc_subscriptions_create` - Create subscription
- `10dlc_subscriptions_list` - List subscriptions
- `10dlc_subscriptions_delete` - Delete subscription
- And more...

### CDRs & Recordings (9 tools)
- `cdr_list` - List call detail records
- `cdr_get` - Get CDR details
- `cdr_list_all` - List all CDRs
- `cdr_export` - Export CDRs
- `cdr_transcription_get` - Get call transcription
- `cdr_retranscribe_update` - Retranscribe call
- `recordings_list` - List call recordings
- `recording_get_by_cdr` - Get recording by CDR
- `recordings_delete` - Delete recordings

### Billing (3 tools)
- `billing_transactions_list` - List transactions
- `billing_invoices_list` - List invoices
- `billing_invoices_get` - Get invoice details

### Profile (3 tools)
- `profile_get` - Get account profile
- `profile_update` - Update profile
- `profile_config_list` - List profile config

### SIP Trunking (5 tools)
- `sip_trunks_list` - List SIP trunks
- `sip_trunk_create` - Create SIP trunk
- `sip_trunk_get` - Get trunk details
- `sip_trunk_update` - Update trunk
- `sip_trunk_delete` - Delete trunk

### Number Buying (5 tools)
- `buy_countries_list` - List available countries
- `buy_regions_list` - List regions
- `buy_cities_list` - List cities
- `buy_region_cities_list` - List cities in region
- `buy_numbers_available` - Search available numbers

### Cart (4 tools)
- `cart_get` - Get cart contents
- `buy_cart_update` - Update cart
- `cart_clear` - Clear cart
- `cart_checkout` - Checkout cart

### Sub-accounts (5 tools)
- `sub_organizations_list` - List sub-accounts
- `sub_organizations_create` - Create sub-account
- `sub_organizations_get` - Get sub-account details
- `sub_organizations_update` - Update sub-account
- `sub_organizations_billing_transactions_get` - Get sub-account transactions

### Other Tools
- **Call Webhooks** (3 tools) - Manage webhook configurations
- **Speech Analytics** (4 tools) - Speech analysis and transcription
- **Voice Campaigns** (2 tools) - Voice campaign management
- **Link Shortener** (2 tools) - URL shortening
- **Number Validator** (3 tools) - Phone number validation
- **Wavix Embeddable** (5 tools) - WebRTC token management

> See [full API documentation](https://wavix.com/docs) for complete tool reference.

## Resources

Access 97 documentation files via MCP Resources:

- **API Reference** (`wavix://api/...`) - Complete API documentation
  - Getting started guides
  - SMS/MMS messaging
  - Voice calls and CDR
  - Phone numbers management
  - SIP trunking
  - 10DLC registration
  - Webhooks setup
  - Error codes and troubleshooting

- **Product Documentation** (`wavix://product/...`) - Product guides
  - Product overviews
  - Pricing information
  - FAQ sections
  - Integration guides
  - Use cases

**Example:**
```
User: "Show me Wavix SMS API documentation"
AI: [Retrieves wavix://api/messaging/send-sms resource]
```

## Prompts

31 pre-built prompts for code integration and common operations:

### Integration Prompts
- `wavix-integrate` - Generate integration code (Node.js, Python, PHP, etc.)
- `wavix-webhook-setup` - Webhook configuration guide
- `wavix-quickstart` - Quick start guide

### Operational Prompts
- `send_sms` - Send SMS message
- `call_start` - Initiate call
- `setup_sender_id` - Register sender ID
- `register_10dlc_brand` - Register 10DLC brand
- `search_phone_numbers` - Search available numbers
- `buy_phone_number` - Purchase number
- And 25+ more...

**Example:**
```
User: "Generate code to send SMS in Node.js"
AI: [Uses wavix-integrate prompt]
```

## Examples

### Without API Key (Documentation Mode)

```
User: "How do I send SMS in Node.js?"
AI: [Uses wavix-integrate prompt to generate code]

User: "Show me Wavix API documentation for SMS"
AI: [Retrieves wavix://api/messaging/send-sms resource]

User: "What are the error codes for SMS?"
AI: [Retrieves wavix://api/messaging/errors documentation]
```

### With API Key (Full Mode)

```
User: "Send SMS to +15551234567: Hello from Claude!"
AI: [Uses sms_send tool]
Response: "SMS sent! Message ID: msg-abc123"

User: "Check my account balance"
AI: [Uses billing_balance_get tool]
Response: "Your balance is $125.50"

User: "List my phone numbers"
AI: [Uses numbers_list tool]
Response: [List of numbers]
```

## Configuration

| Environment Variable | Required | Default | Description |
|---------------------|----------|---------|-------------|
| `WAVIX_API_KEY` | **Optional** | - | Wavix API key (required for Full Mode) |
| `WAVIX_API_URL` | No | `https://api.wavix.com` | API endpoint |
| `LOG_LEVEL` | No | `info` | Logging level (`debug`, `info`, `warn`, `error`) |
| `NODE_ENV` | No | `development` | Environment (`development`, `production`, `test`) |

### Getting API Key

1. Sign up at [wavix.com](https://wavix.com)
2. Go to [API Keys](https://wavix.com/api-keys)
3. Create new API key
4. Copy key (starts with `wvx_`)



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
│   ├── generated/    # Auto-generated tools (123+)
│   └── handlers/     # Tool handlers
├── helpers/          # Logger, masking, validation
├── resources/        # MCP resources (97 files)
└── prompts/          # MCP prompts (31 prompts)
```

## Troubleshooting

### MCP server not detected in Claude Code

- **Check configuration location**: Claude Code reads MCP config from `~/.claude.json` (user scope) or `.mcp.json` (project scope), NOT from `~/.claude/settings.json`

- **Verify with CLI**:
  ```bash
  claude mcp list
  ```

- **Re-add if missing**:
  ```bash
  claude mcp add wavix -s user -- npx @wavix/mcp-server
  ```

- **Restart Claude Code**: After adding MCP server, restart the session

### Server not starting

- **Check Node.js version**: Requires Node.js >= 20.0.0
  ```bash
  node --version
  ```

- **Verify installation**:
  ```bash
  npm list -g @wavix/mcp-server
  ```

- **Check logs**: Look for error messages in console

### Tools not available

- **Check API key**: Tools require `WAVIX_API_KEY` to be set
- **Verify API key format**: Should start with `wvx_`
- **Check mode**: Server logs show "Full Mode" or "Documentation Mode"

### Documentation not loading

- **Documentation Mode works without API key**: Remove `WAVIX_API_KEY` from config
- **Check MCP server logs**: Look for resource loading errors
- **Verify resources**: Resources are bundled with the package

### API errors

- **Invalid phone number**: Use E.164 format (e.g., `+15551234567`)
- **Insufficient balance**: Check account balance
- **Rate limits**: Wait and retry
- **Check error codes**: See `wavix://api/messaging/errors` documentation

## Links

- [GitHub Repository](https://github.com/evgeniidurin-ai/mcp-wavix)
- [Issue Tracker](https://github.com/evgeniidurin-ai/mcp-wavix/issues)
- [Wavix API Documentation](https://docs.wavix.com/)
- [Get API Key](https://wavix.com/api-keys)
- [Wavix Website](https://wavix.com)

## License

MIT
