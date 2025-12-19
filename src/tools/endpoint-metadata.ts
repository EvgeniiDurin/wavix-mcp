/**
 * Extended Endpoint Metadata
 *
 * Provides additional context for each tool endpoint:
 * - API version
 * - Full endpoint path
 * - Request/response examples
 * - Related documentation
 */

export interface EndpointInfo {
  /** API version (v1, v2, v3) */
  version: string
  /** Base path without version */
  basePath: string
  /** Full path with version */
  fullPath: string
  /** Human-readable description */
  description: string
  /** Related documentation URI */
  docsUri?: string
  /** Related code snippet URI */
  codeSnippetUri?: {
    node?: string
    curl?: string
    python?: string
  }
  /** Example request body */
  exampleRequest?: Record<string, unknown>
  /** Example response */
  exampleResponse?: Record<string, unknown>
}

export interface ToolEndpointInfo {
  /** Tool name */
  name: string
  /** Tool category */
  category: string
  /** Tool description */
  description: string
  /** Map of action name to endpoint info */
  endpoints: Record<string, EndpointInfo>
}

/**
 * Extended metadata for all tools
 */
export const endpointMetadata: Record<string, ToolEndpointInfo> = {
  sms: {
    name: "sms",
    category: "SMS and MMS",
    description: "Send and manage SMS/MMS messages",
    endpoints: {
      send: {
        version: "v3",
        basePath: "/messages",
        fullPath: "/v3/messages",
        description: "Send an SMS or MMS message",
        docsUri: "wavix://api/messaging/send-sms",
        codeSnippetUri: {
          node: "wavix://code/node/send-sms",
          curl: "wavix://code/curl/send-sms"
        },
        exampleRequest: {
          from: "+15551234567",
          to: "+14155551234",
          message_body: {
            text: "Hello from Wavix!"
          }
        },
        exampleResponse: {
          message_id: "871b4eeb-f798-4105-be23-32df9e991456",
          message_type: "sms",
          from: "+15551234567",
          to: "+14155551234",
          status: "accepted",
          segments: 1,
          charge: "0.01"
        }
      },
      get: {
        version: "v3",
        basePath: "/messages/{id}",
        fullPath: "/v3/messages/{id}",
        description: "Get message details and delivery status",
        docsUri: "wavix://api/messaging/send-sms",
        codeSnippetUri: {
          node: "wavix://code/node/send-sms",
          curl: "wavix://code/curl/send-sms"
        },
        exampleResponse: {
          message: {
            message_id: "871b4eeb-f798-4105-be23-32df9e991456",
            status: "delivered",
            delivered_at: "2025-01-15T10:30:05.000Z"
          }
        }
      },
      list: {
        version: "v3",
        basePath: "/messages",
        fullPath: "/v3/messages",
        description: "List messages on your account",
        docsUri: "wavix://api/messaging/send-sms"
      },
      list_all: {
        version: "v3",
        basePath: "/messages/all",
        fullPath: "/v3/messages/all",
        description: "Get all messages in NDJSON format"
      },
      opt_out: {
        version: "v3",
        basePath: "/messages/opt_outs",
        fullPath: "/v3/messages/opt_outs",
        description: "Unsubscribe a phone number from SMS messages"
      }
    }
  },

  validation: {
    name: "validation",
    category: "Number Validator",
    description: "Validate phone numbers and lookup carrier info",
    endpoints: {
      list: {
        version: "v2",
        basePath: "/lookup",
        fullPath: "/v2/lookup",
        description: "Validate a single phone number",
        docsUri: "wavix://api/numbers/number-validator",
        codeSnippetUri: {
          node: "wavix://code/node/validate-number",
          curl: "wavix://code/curl/validate-number"
        },
        exampleRequest: {
          phone_number: "+14155551234",
          type: "analysis"
        },
        exampleResponse: {
          phone_number: "+14155551234",
          valid: true,
          country_code: "US",
          number_type: "mobile",
          carrier_name: "T-Mobile USA"
        }
      },
      create: {
        version: "v2",
        basePath: "/lookup",
        fullPath: "/v2/lookup",
        description: "Validate multiple phone numbers (batch)",
        docsUri: "wavix://api/numbers/number-validator",
        codeSnippetUri: {
          node: "wavix://code/node/validate-number",
          curl: "wavix://code/curl/validate-number"
        }
      },
      get: {
        version: "v2",
        basePath: "/lookup/{uuid}",
        fullPath: "/v2/lookup/{uuid}",
        description: "Get async validation results"
      }
    }
  },

  two_fa: {
    name: "two_fa",
    category: "2FA",
    description: "Two-factor authentication service",
    endpoints: {
      send: {
        version: "v1",
        basePath: "/2fa/verification",
        fullPath: "/v1/2fa/verification",
        description: "Send a verification code via SMS or voice",
        docsUri: "wavix://api/messaging/2fa",
        codeSnippetUri: {
          node: "wavix://code/node/two-fa",
          curl: "wavix://code/curl/two-fa"
        },
        exampleRequest: {
          service_id: "your-service-id",
          to: "+14155551234",
          channel: "sms"
        },
        exampleResponse: {
          session_uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          status: "pending",
          channel: "sms"
        }
      },
      check: {
        version: "v1",
        basePath: "/2fa/verification/{session_uuid}/check",
        fullPath: "/v1/2fa/verification/{session_uuid}/check",
        description: "Verify the code entered by user",
        docsUri: "wavix://api/messaging/2fa",
        codeSnippetUri: {
          node: "wavix://code/node/two-fa",
          curl: "wavix://code/curl/two-fa"
        },
        exampleRequest: {
          code: "123456"
        },
        exampleResponse: {
          valid: true,
          status: "approved"
        }
      },
      resend: {
        version: "v1",
        basePath: "/2fa/verification/{session_uuid}/resend",
        fullPath: "/v1/2fa/verification/{session_uuid}/resend",
        description: "Resend verification code"
      },
      sessions: {
        version: "v1",
        basePath: "/2fa/verification",
        fullPath: "/v1/2fa/verification",
        description: "List 2FA verification sessions"
      },
      cancel: {
        version: "v1",
        basePath: "/2fa/verification/{session_uuid}",
        fullPath: "/v1/2fa/verification/{session_uuid}",
        description: "Cancel a verification session"
      }
    }
  },

  calls: {
    name: "calls",
    category: "Call control",
    description: "Control voice calls - create, manage, record",
    endpoints: {
      create: {
        version: "v2",
        basePath: "/calls",
        fullPath: "/v2/calls",
        description: "Initiate a new outbound call",
        docsUri: "wavix://api/voice/call-streaming",
        codeSnippetUri: {
          node: "wavix://code/node/make-call",
          curl: "wavix://code/curl/make-call"
        },
        exampleRequest: {
          from: "+15551234567",
          to: "+14155551234",
          call_recording: true
        },
        exampleResponse: {
          uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          status: "initiated",
          direction: "outbound"
        }
      },
      list: {
        version: "v2",
        basePath: "/calls",
        fullPath: "/v2/calls",
        description: "List active calls"
      },
      get: {
        version: "v2",
        basePath: "/calls/{uuid}",
        fullPath: "/v2/calls/{uuid}",
        description: "Get call details"
      },
      hangup: {
        version: "v2",
        basePath: "/calls/{uuid}/hangup",
        fullPath: "/v2/calls/{uuid}/hangup",
        description: "End an active call"
      },
      answer: {
        version: "v2",
        basePath: "/calls/{uuid}/answer",
        fullPath: "/v2/calls/{uuid}/answer",
        description: "Answer an inbound call"
      },
      play: {
        version: "v2",
        basePath: "/calls/{uuid}/audio",
        fullPath: "/v2/calls/{uuid}/audio",
        description: "Play audio during a call"
      },
      audio_delete: {
        version: "v2",
        basePath: "/calls/{uuid}/audio",
        fullPath: "/v2/calls/{uuid}/audio",
        description: "Stop audio playback"
      },
      collect_dtmf: {
        version: "v2",
        basePath: "/calls/{uuid}/dtmf",
        fullPath: "/v2/calls/{uuid}/dtmf",
        description: "Collect DTMF input from caller"
      },
      stream_start: {
        version: "v2",
        basePath: "/calls/{uuid}/stream",
        fullPath: "/v2/calls/{uuid}/stream",
        description: "Start WebSocket streaming"
      },
      stream_stop: {
        version: "v2",
        basePath: "/calls/{uuid}/stream/{stream_uuid}",
        fullPath: "/v2/calls/{uuid}/stream/{stream_uuid}",
        description: "Stop WebSocket streaming"
      }
    }
  },

  sip_trunks: {
    name: "sip_trunks",
    category: "SIP trunks",
    description: "Manage SIP trunk configurations",
    endpoints: {
      list: {
        version: "v1",
        basePath: "/trunks",
        fullPath: "/v1/trunks",
        description: "List all SIP trunks on the account",
        docsUri: "wavix://api/sip-trunking/sip-trunks"
      },
      create: {
        version: "v1",
        basePath: "/trunks",
        fullPath: "/v1/trunks",
        description: "Create a new SIP trunk"
      },
      get: {
        version: "v1",
        basePath: "/trunks/{id}",
        fullPath: "/v1/trunks/{id}",
        description: "Get SIP trunk configuration"
      },
      update: {
        version: "v1",
        basePath: "/trunks/{id}",
        fullPath: "/v1/trunks/{id}",
        description: "Update SIP trunk configuration"
      },
      delete: {
        version: "v1",
        basePath: "/trunks/{id}",
        fullPath: "/v1/trunks/{id}",
        description: "Delete a SIP trunk"
      }
    }
  },

  numbers: {
    name: "numbers",
    category: "My numbers",
    description: "Manage your phone numbers (DIDs)",
    endpoints: {
      list: {
        version: "v1",
        basePath: "/mydids",
        fullPath: "/v1/mydids",
        description: "List all DIDs on your account",
        docsUri: "wavix://api/numbers/numbers"
      },
      get: {
        version: "v1",
        basePath: "/mydids/{id}",
        fullPath: "/v1/mydids/{id}",
        description: "Get specific number details"
      },
      update: {
        version: "v1",
        basePath: "/mydids/{id}",
        fullPath: "/v1/mydids/{id}",
        description: "Update number settings"
      },
      delete: {
        version: "v1",
        basePath: "/mydids/release",
        fullPath: "/v1/mydids/release",
        description: "Release numbers from account"
      },
      update_sms: {
        version: "v1",
        basePath: "/mydids/{id}/sms",
        fullPath: "/v1/mydids/{id}/sms",
        description: "Enable/disable SMS for a number"
      },
      update_destinations: {
        version: "v1",
        basePath: "/mydids/destinations",
        fullPath: "/v1/mydids/destinations",
        description: "Update inbound call destinations"
      }
    }
  },

  cdrs: {
    name: "cdrs",
    category: "CDRs",
    description: "Access call detail records",
    endpoints: {
      list: {
        version: "v2",
        basePath: "/cdrs",
        fullPath: "/v2/cdrs",
        description: "Get call detail records",
        docsUri: "wavix://api/voice/cdr"
      },
      list_all: {
        version: "v2",
        basePath: "/cdrs/all",
        fullPath: "/v2/cdrs/all",
        description: "Get CDRs in NDJSON format"
      },
      get: {
        version: "v2",
        basePath: "/cdrs/{uuid}",
        fullPath: "/v2/cdrs/{uuid}",
        description: "Get specific call details"
      },
      export: {
        version: "v2",
        basePath: "/cdrs/search",
        fullPath: "/v2/cdrs/search",
        description: "Search calls by keywords"
      },
      retranscribe: {
        version: "v2",
        basePath: "/cdrs/{cdr_uuid}/transcription",
        fullPath: "/v2/cdrs/{cdr_uuid}/transcription",
        description: "Request call transcription"
      },
      transcription: {
        version: "v2",
        basePath: "/cdrs/{cdr_uuid}/transcription",
        fullPath: "/v2/cdrs/{cdr_uuid}/transcription",
        description: "Get call transcription"
      }
    }
  }
}

/**
 * Get endpoint info for a specific tool and action
 */
export function getEndpointInfo(toolName: string, action: string): EndpointInfo | undefined {
  return endpointMetadata[toolName]?.endpoints[action]
}

/**
 * Get full tool info
 */
export function getToolInfo(toolName: string): ToolEndpointInfo | undefined {
  return endpointMetadata[toolName]
}

/**
 * Get all tools with their endpoint info
 */
export function listToolsWithEndpoints(): Array<ToolEndpointInfo> {
  return Object.values(endpointMetadata)
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): Array<ToolEndpointInfo> {
  return Object.values(endpointMetadata).filter(t => t.category === category)
}
