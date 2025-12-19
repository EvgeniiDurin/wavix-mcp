# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Renamed "Documentation Mode" to "Setup Mode" for better clarity
  - Setup Mode emphasizes planning, code generation, and integration capabilities
  - Better reflects that users can do more than just read documentation
- Updated tool counts: 78 tools (31 generated + 3 smart + 3 integration + 26 troubleshooting + 15 workflow)
- Updated resource counts: 103 documentation resources (62 API + 33 product + 8 code snippets)
- Updated prompt counts: 57 prompts for code integration and common operations
- Updated installation instructions to reflect GitHub-based setup (before npm publish)
- Improved README examples with more detailed integration scenarios

### Added
- Initial release of Wavix MCP Server
- 78 tools total: auto-generated tools, smart tools, integration helpers, troubleshooting, and workflow recipes
- Documentation resources (103 files) for API and product documentation
- 57 prompts for common operations and code integration
- Two operating modes: Setup Mode (no API key) and Full Mode (with API key)
- HTTP client with retry logic for 429/5xx errors
- Comprehensive error handling and validation
- ELK-compatible JSON logging
- TypeScript type generation from OpenAPI spec
- Tool auto-generation from OpenAPI specification

### Features
- **SMS & MMS**: Send messages, check delivery status, message history
- **Voice Calls**: Initiate calls, call control, call history
- **Phone Numbers**: Search, purchase, configure numbers
- **2FA**: Send verification codes, verify codes
- **10DLC**: Brand and campaign registration
- **Billing**: Account balance, transaction history
- **CDR & Recordings**: Call detail records, call recordings
- **Webhooks**: Delivery reports, inbound messages
- **SIP Trunking**: SIP trunk management
- **Sub-accounts**: Multi-account support

## [1.0.0] - 2025-12-18

### Added
- Initial public release
- Full API coverage (123 operations)
- OpenAPI-first approach
- MCP (Model Context Protocol) server implementation
- Comprehensive documentation and examples




