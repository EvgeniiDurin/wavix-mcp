/**
 * Tool Grouping Configuration
 *
 * Defines how individual API operations are grouped into unified MCP tools
 * Each group becomes a single tool with an "action" parameter
 */

export interface ToolGroupConfig {
  /** Tool name (e.g., "sip_trunks") */
  name: string
  /** Human-readable description */
  description: string
  /** Category for organization */
  category: string
  /** Map of action name to path+method */
  actions: Record<string, { path: string; method: string }>
}

/**
 * Tool grouping configuration
 * Groups related CRUD operations into single tools with action parameter
 */
export const toolGroups: ToolGroupConfig[] = [
  // === SIP Trunks ===
  {
    name: "sip_trunks",
    description: "Manage SIP trunks: list all trunks, create new trunk, get/update/delete by ID",
    category: "SIP trunks",
    actions: {
      list: { path: "/trunks", method: "GET" },
      create: { path: "/trunks", method: "POST" },
      get: { path: "/trunks/{id}", method: "GET" },
      update: { path: "/trunks/{id}", method: "PUT" },
      delete: { path: "/trunks/{id}", method: "DELETE" }
    }
  },

  // === Buy Numbers ===
  {
    name: "buy_numbers",
    description: "Browse available phone numbers: list countries, regions, cities, and available DIDs",
    category: "Buy",
    actions: {
      countries: { path: "/buy/countries", method: "GET" },
      regions: { path: "/buy/countries/{country}/regions", method: "GET" },
      cities: { path: "/buy/countries/{country}/cities", method: "GET" },
      region_cities: { path: "/buy/countries/{country}/regions/{region}/cities", method: "GET" },
      available: { path: "/buy/countries/{country}/cities/{city}/dids", method: "GET" }
    }
  },

  // === Cart ===
  {
    name: "cart",
    description: "Manage shopping cart: view cart, add/remove items, clear cart, checkout",
    category: "Cart",
    actions: {
      get: { path: "/buy/cart", method: "GET" },
      update: { path: "/buy/cart", method: "PUT" },
      clear: { path: "/buy/cart", method: "DELETE" },
      checkout: { path: "/buy/cart/checkout", method: "POST" }
    }
  },

  // === My Numbers ===
  {
    name: "numbers",
    description: "Manage your phone numbers (DIDs): list, get details, update settings, delete, upload papers",
    category: "My numbers",
    actions: {
      list: { path: "/mydids", method: "GET" },
      get: { path: "/mydids/{id}", method: "GET" },
      update: { path: "/mydids/{id}", method: "PUT" },
      delete: { path: "/mydids", method: "DELETE" },
      update_sms: { path: "/mydids/update-sms-enabled", method: "PUT" },
      update_destinations: { path: "/mydids/update-destinations", method: "POST" },
      upload_papers: { path: "/mydids/papers", method: "POST" }
    }
  },

  // === CDRs ===
  {
    name: "cdrs",
    description: "Access call detail records: list CDRs, get details, export, manage transcriptions",
    category: "CDRs",
    actions: {
      list: { path: "/cdr", method: "GET" },
      list_all: { path: "/cdr/all", method: "GET" },
      get: { path: "/cdr/{uuid}", method: "GET" },
      export: { path: "/cdr", method: "POST" },
      retranscribe: { path: "/cdr/{cdr_uuid}/retranscribe", method: "PUT" },
      transcription: { path: "/cdr/{cdr_uuid}/transcription", method: "GET" }
    }
  },

  // === Recordings ===
  {
    name: "recordings",
    description: "Manage call recordings: list recordings, get by CDR UUID, delete",
    category: "Call recording",
    actions: {
      list: { path: "/recordings", method: "GET" },
      get: { path: "/recordings/{cdr_uuid}", method: "GET" },
      delete: { path: "/recordings/{id}", method: "DELETE" }
    }
  },

  // === Speech Analytics ===
  {
    name: "speech_analytics",
    description: "Manage speech analytics: create analysis, get/update results, download files",
    category: "Speech Analytics",
    actions: {
      create: { path: "/speech-analytics", method: "POST" },
      get: { path: "/speech-analytics/{uuid}", method: "GET" },
      update: { path: "/speech-analytics/{uuid}", method: "PUT" },
      download: { path: "/speech-analytics/{uuid}/file", method: "GET" }
    }
  },

  // === Call Webhooks ===
  {
    name: "call_webhooks",
    description: "Manage call webhooks: get current settings, create/update webhooks, delete",
    category: "Call webhooks",
    actions: {
      get: { path: "/call/webhooks", method: "GET" },
      create: { path: "/call/webhooks", method: "POST" },
      delete: { path: "/call/webhooks", method: "DELETE" }
    }
  },

  // === Call Control ===
  {
    name: "calls",
    description:
      "Control calls: initiate calls, list active calls, get call details, answer, hangup, play audio, collect DTMF, manage streams",
    category: "Call control",
    actions: {
      create: { path: "/call", method: "POST" },
      list: { path: "/call", method: "GET" },
      get: { path: "/call/{uuid}", method: "GET" },
      hangup: { path: "/call/{uuid}", method: "DELETE" },
      answer: { path: "/call/{uuid}/answer", method: "POST" },
      play: { path: "/call/{uuid}/play", method: "POST" },
      audio_delete: { path: "/call/{uuid}/audio", method: "DELETE" },
      collect_dtmf: { path: "/call/{uuid}/collect", method: "POST" },
      stream_start: { path: "/call/{uuid}/streams", method: "POST" },
      stream_stop: { path: "/call/{uuid}/streams/{stream_uuid}", method: "DELETE" }
    }
  },

  // === WebRTC Tokens ===
  {
    name: "webrtc_tokens",
    description: "Manage WebRTC tokens for Wavix Embeddable: list, create, get, update, delete tokens",
    category: "Wavix Embeddable",
    actions: {
      list: { path: "/webrtc/tokens", method: "GET" },
      create: { path: "/webrtc/tokens", method: "POST" },
      get: { path: "/webrtc/tokens/{uuid}", method: "GET" },
      update: { path: "/webrtc/tokens/{uuid}", method: "PUT" },
      delete: { path: "/webrtc/tokens/{uuid}", method: "DELETE" }
    }
  },

  // === SMS ===
  {
    name: "sms",
    description: "Send and manage SMS/MMS messages: send messages, list sent/received, get message details, manage opt-outs",
    category: "SMS and MMS",
    actions: {
      send: { path: "/messages", method: "POST" },
      list: { path: "/messages", method: "GET" },
      list_all: { path: "/messages/all", method: "GET" },
      get: { path: "/messages/{id}", method: "GET" },
      opt_out: { path: "/messages/opt_outs", method: "POST" }
    }
  },

  // === SMS Sender IDs ===
  {
    name: "sms_sender_ids",
    description: "Manage SMS sender IDs: list, create, get details, delete sender IDs",
    category: "SMS and MMS",
    actions: {
      list: { path: "/messages/sender_ids", method: "GET" },
      create: { path: "/messages/sender_ids", method: "POST" },
      get: { path: "/messages/sender_ids/{id}", method: "GET" },
      delete: { path: "/messages/sender_ids/{id}", method: "DELETE" }
    }
  },

  // === 10DLC Brands (brands + evidence + vetting + usecases) ===
  {
    name: "10dlc_brands",
    description:
      "Manage 10DLC brands: register/update brands, manage evidence documents, request vetting, check use case eligibility",
    category: "10DLC",
    actions: {
      // Brands
      list: { path: "/10dlc/brands", method: "GET" },
      create: { path: "/10dlc/brands", method: "POST" },
      get: { path: "/10dlc/brands/{brand_id}", method: "GET" },
      update: { path: "/10dlc/brands/{brand_id}", method: "PUT" },
      delete: { path: "/10dlc/brands/{brand_id}", method: "DELETE" },
      appeals_list: { path: "/10dlc/brands/{brand_id}/appeals", method: "GET" },
      appeal_create: { path: "/10dlc/brands/{brand_id}/appeals", method: "POST" },
      // Evidence
      evidence_list: { path: "/10dlc/brands/{brand_id}/evidence", method: "GET" },
      evidence_upload: { path: "/10dlc/brands/{brand_id}/evidence", method: "POST" },
      evidence_get: { path: "/10dlc/brands/{brand_id}/evidence/{uuid}", method: "GET" },
      evidence_delete: { path: "/10dlc/brands/{brand_id}/evidence/{uuid}", method: "DELETE" },
      // Vetting
      vetting_list: { path: "/10dlc/brands/{brand_id}/vettings", method: "GET" },
      vetting_create: { path: "/10dlc/brands/{brand_id}/vettings", method: "POST" },
      vetting_appeal_create: { path: "/10dlc/brands/{brand_id}/vettings/appeals", method: "POST" },
      vetting_appeal_list: { path: "/10dlc/brands/{brand_id}/vettings/appeals", method: "GET" },
      // Use Cases
      usecase_get: { path: "/10dlc/brands/{brand_id}/usecases/{use_case}", method: "GET" }
    }
  },

  // === 10DLC Campaigns (campaigns + subscriptions) ===
  {
    name: "10dlc_campaigns",
    description: "Manage 10DLC campaigns: create/update campaigns, nudge for approval, manage event subscriptions",
    category: "10DLC",
    actions: {
      // Campaigns
      list: { path: "/10dlc/brands/campaigns", method: "GET" },
      list_by_brand: { path: "/10dlc/brands/{brand_id}/campaigns", method: "GET" },
      create: { path: "/10dlc/brands/{brand_id}/campaigns", method: "POST" },
      get: { path: "/10dlc/brands/{brand_id}/campaigns/{campaign_id}", method: "GET" },
      update: { path: "/10dlc/brands/{brand_id}/campaigns/{campaign_id}", method: "PUT" },
      delete: { path: "/10dlc/brands/{brand_id}/campaigns/{campaign_id}", method: "DELETE" },
      nudge: { path: "/10dlc/brands/{brand_id}/campaigns/{campaign_id}/nudge", method: "POST" },
      // Subscriptions
      subscriptions_list: { path: "/10dlc/subscriptions", method: "GET" },
      subscriptions_create: { path: "/10dlc/subscriptions", method: "POST" },
      subscriptions_delete: { path: "/10dlc/subscriptions", method: "DELETE" }
    }
  },

  // === Number Validator ===
  {
    name: "validation",
    description: "Validate phone numbers: validate single number, batch validate, get async results",
    category: "Number Validator",
    actions: {
      list: { path: "/validation", method: "GET" },
      create: { path: "/validation", method: "POST" },
      get: { path: "/validation/{uuid}", method: "GET" }
    }
  },

  // === Voice Campaigns ===
  {
    name: "voice_campaigns",
    description: "Manage voice campaigns: create campaigns, get campaign details and status",
    category: "Voice campaigns",
    actions: {
      create: { path: "/voice-campaigns", method: "POST" },
      get: { path: "/voice-campaigns/{id}", method: "GET" }
    }
  },

  // === Link Shortener ===
  {
    name: "short_links",
    description: "Manage short links: create shortened URLs, view click metrics",
    category: "Link shortener",
    actions: {
      create: { path: "/short-links", method: "POST" },
      metrics: { path: "/short-links/metrics", method: "GET" }
    }
  },

  // === 2FA ===
  {
    name: "two_fa",
    description: "Two-factor authentication: send verification codes, check codes, cancel verifications, view sessions",
    category: "2FA",
    actions: {
      send: { path: "/two-fa/verification", method: "POST" },
      resend: { path: "/two-fa/verification/{session_uuid}", method: "POST" },
      sessions: { path: "/two-fa/service/{service_uuid}/sessions", method: "GET" },
      check: { path: "/two-fa/verification/{session_uuid}/check", method: "POST" },
      cancel: { path: "/two-fa/verification/{session_uuid}/cancel", method: "PATCH" }
    }
  },

  // === Billing ===
  {
    name: "billing",
    description: "Access billing information: view transactions, download invoices/statements",
    category: "Billing",
    actions: {
      transactions: { path: "/billing/transactions", method: "GET" },
      invoices: { path: "/billing/invoices", method: "GET" },
      invoice_download: { path: "/billing/invoices/{id}", method: "GET" }
    }
  },

  // === Profile ===
  {
    name: "profile",
    description:
      "Manage account profile. Actions: get (profile info: name, email, company), update (modify profile), config (account balance and limits)",
    category: "Profile",
    actions: {
      get: { path: "/profile", method: "GET" },
      update: { path: "/profile", method: "PUT" },
      config: { path: "/profile/config", method: "GET" }
    }
  },

  // === Sub-accounts ===
  {
    name: "sub_accounts",
    description: "Manage sub-accounts: list, create, get/update details, view billing transactions",
    category: "Sub-accounts",
    actions: {
      list: { path: "/sub-organizations", method: "GET" },
      create: { path: "/sub-organizations", method: "POST" },
      get: { path: "/sub-organizations/{id}", method: "GET" },
      update: { path: "/sub-organizations/{id}", method: "PUT" },
      transactions: { path: "/sub-organizations/{id}/billing/transactions", method: "GET" }
    }
  },

  // === Config (dynamic API URL) ===
  {
    name: "config",
    description: "Manage MCP server configuration: get/set API base URL dynamically",
    category: "Config",
    actions: {
      get_api_url: { path: "__config__/api_url", method: "GET" },
      set_api_url: { path: "__config__/api_url", method: "PUT" }
    }
  }
]

/**
 * Get all action names across all groups
 */
export function getAllActions(): string[] {
  const actions: string[] = []
  for (const group of toolGroups) {
    actions.push(...Object.keys(group.actions))
  }
  return actions
}

/**
 * Find group and action by path and method
 */
export function findGroupByPathMethod(
  path: string,
  method: string
): { group: ToolGroupConfig; action: string } | undefined {
  for (const group of toolGroups) {
    for (const [actionName, actionConfig] of Object.entries(group.actions)) {
      if (actionConfig.path === path && actionConfig.method === method.toUpperCase()) {
        return { group, action: actionName }
      }
    }
  }
  return undefined
}
