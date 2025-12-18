/**
 * Response Configuration
 *
 * Defines how MCP tool responses should be transformed to optimize token usage.
 * Each tool can have per-action configuration for pagination, field selection, etc.
 */

export interface ResponseConfig {
  /** Maximum items to return in list responses (triggers truncation warning if exceeded) */
  maxItems?: number
  /** Default pagination params to apply if not provided */
  defaultParams?: Record<string, unknown>
  /** Only include these fields in list items (summary mode) */
  summaryFields?: Array<string>
  /** Fields to exclude from response */
  excludeFields?: Array<string>
  /** Whether this action typically returns large responses */
  expectLargeResponse?: boolean
}

export interface ToolResponseConfig {
  actions: Record<string, ResponseConfig>
}

/**
 * Response configuration per tool
 *
 * Optimizes token usage by:
 * 1. Setting default pagination limits
 * 2. Returning only essential fields for list operations
 * 3. Excluding verbose/redundant fields
 */
export const responseConfig: Record<string, ToolResponseConfig> = {
  sms_sender_ids: {
    actions: {
      list: {
        maxItems: 25,
        summaryFields: ["id", "sender_id", "type", "usecase", "allowlisted_in"],
        excludeFields: ["samples"], // samples can be very long
        expectLargeResponse: true
      },
      get: {
        // Full details for single item
      }
    }
  },

  numbers: {
    actions: {
      list: {
        maxItems: 50,
        defaultParams: { per_page: 50 },
        summaryFields: ["id", "number", "label", "status", "sms_enabled", "voice_enabled"],
        expectLargeResponse: true
      }
    }
  },

  sms: {
    actions: {
      list: {
        maxItems: 30,
        defaultParams: { per_page: 30 },
        summaryFields: ["id", "from", "to", "status", "created_at", "direction"],
        excludeFields: ["message_body"], // Can be very long
        expectLargeResponse: true
      },
      list_all: {
        maxItems: 100,
        expectLargeResponse: true
      }
    }
  },

  cdrs: {
    actions: {
      list: {
        maxItems: 50,
        defaultParams: { per_page: 50 },
        summaryFields: ["uuid", "from", "to", "duration", "disposition", "cost", "created_at"],
        expectLargeResponse: true
      },
      list_all: {
        maxItems: 100,
        expectLargeResponse: true
      }
    }
  },

  recordings: {
    actions: {
      list: {
        maxItems: 30,
        summaryFields: ["id", "call_uuid", "duration", "created_at", "url"],
        expectLargeResponse: true
      }
    }
  },

  sip_trunks: {
    actions: {
      list: {
        maxItems: 20,
        summaryFields: ["id", "label", "callerid", "status", "created_at"]
      }
    }
  },

  "10dlc_brands": {
    actions: {
      list: {
        maxItems: 20,
        summaryFields: ["brand_id", "dba_name", "company_name", "status", "entity_type"],
        expectLargeResponse: true
      }
    }
  },

  "10dlc_campaigns": {
    actions: {
      list: {
        maxItems: 20,
        summaryFields: ["campaign_id", "name", "brand_id", "usecase", "status"],
        expectLargeResponse: true
      },
      list_by_brand: {
        maxItems: 20,
        summaryFields: ["campaign_id", "name", "usecase", "status"]
      }
    }
  },

  billing: {
    actions: {
      transactions: {
        maxItems: 50,
        defaultParams: { per_page: 50 },
        summaryFields: ["id", "type", "amount", "balance", "created_at", "details"],
        expectLargeResponse: true
      }
    }
  },

  buy_numbers: {
    actions: {
      countries: {
        maxItems: 50,
        summaryFields: ["id", "name", "code", "prefix"]
      },
      regions: {
        maxItems: 50,
        summaryFields: ["id", "name", "code"]
      },
      cities: {
        maxItems: 100,
        summaryFields: ["id", "name", "prefix"]
      },
      available: {
        maxItems: 30,
        summaryFields: ["id", "number", "monthly_fee", "setup_fee", "sms_enabled", "voice_enabled"]
      }
    }
  },

  webrtc_tokens: {
    actions: {
      list: {
        maxItems: 20,
        summaryFields: ["uuid", "sip_trunk", "created_at", "expires_at"]
      }
    }
  },

  sub_accounts: {
    actions: {
      list: {
        maxItems: 30,
        summaryFields: ["id", "name", "status", "balance", "created_at"]
      },
      transactions: {
        maxItems: 50,
        summaryFields: ["id", "type", "amount", "created_at"]
      }
    }
  },

  validation: {
    actions: {
      create: {
        maxItems: 100, // Bulk validation can return many results
        summaryFields: ["phone_number", "valid", "carrier", "type", "country"]
      }
    }
  },

  short_links: {
    actions: {
      metrics: {
        maxItems: 50,
        summaryFields: ["short_url", "clicks", "unique_clicks", "created_at"]
      }
    }
  }
}

/**
 * Get response config for a specific tool and action
 */
export function getResponseConfig(toolName: string, action: string): ResponseConfig | undefined {
  return responseConfig[toolName]?.actions[action]
}

/**
 * Check if a tool/action expects large responses
 */
export function expectsLargeResponse(toolName: string, action: string): boolean {
  return responseConfig[toolName]?.actions[action]?.expectLargeResponse ?? false
}
