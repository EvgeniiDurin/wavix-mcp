/**
 * Generated MCP Tools from OpenAPI
 *
 * AUTO-GENERATED - DO NOT EDIT
 * Generated at: 2025-12-18T10:03:42.564Z
 * Source: ./api/wavix-api.yaml
 *
 * Run: pnpm generate:tools
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js"

export interface ToolMetaInfo {
  path: string
  method: string
  operationId: string
}

/**
 * Tool categories for organization
 */
export const toolCategories: Record<string, string[]> = {
  "SIP trunks": ["sip_trunks_list", "sip_trunk_create", "sip_trunk_get", "sip_trunk_update", "sip_trunk_delete"],
  Buy: ["buy_countries_list", "buy_regions_list", "buy_cities_list", "buy_region_cities_list", "buy_numbers_available"],
  Cart: ["buy_cart_update", "cart_get", "cart_clear", "cart_checkout"],
  "My numbers": [
    "numbers_list",
    "numbers_bulk_delete",
    "number_get",
    "mydids_update",
    "numbers_sms_update",
    "mydids_update_destinations_create",
    "numbers_papers_upload"
  ],
  CDRs: ["cdr_list", "cdr_export", "cdr_retranscribe_update", "cdr_transcription_get", "cdr_get", "cdr_list_all"],
  "Call recording": ["recordings_list", "recording_get_by_cdr", "recordings_delete"],
  "Speech Analytics": [
    "speech_analytics_create",
    "speech_analytics_get",
    "speech_analytics_update",
    "speech_analytics_file_download"
  ],
  "Call webhooks": ["call_webhooks_get", "call_webhooks_create", "call_webhooks_delete"],
  "Call control": [
    "call_create",
    "calls_list",
    "call_get",
    "call_hangup",
    "call_answer",
    "call_stream_start",
    "call_stream_stop",
    "call_play",
    "call_audio_delete",
    "call_dtmf_collect"
  ],
  "Wavix Embeddable": [
    "webrtc_token_create",
    "webrtc_tokens_list",
    "webrtc_token_get",
    "webrtc_token_update",
    "webrtc_token_delete"
  ],
  "SMS and MMS": [
    "sms_sender_ids_list",
    "sms_sender_id_create",
    "sms_sender_id_get",
    "sms_sender_id_delete",
    "sms_opt_out_add",
    "sms_send",
    "sms_list",
    "sms_get",
    "sms_list_all"
  ],
  "10DLC": [
    "tcr_brands_list",
    "tcr_brand_create",
    "tcr_brand_get",
    "tcr_brand_update",
    "tcr_brand_delete",
    "tcr_brand_appeal_create",
    "tcr_brand_appeals_list",
    "tcr_evidence_upload",
    "tcr_evidence_list",
    "tcr_evidence_get",
    "tcr_evidence_delete",
    "tcr_vetting_create",
    "10dlc_brands_vettings_update",
    "tcr_vettings_list",
    "tcr_vetting_appeal_create",
    "10dlc_brands_vettings_appeals_get",
    "tcr_usecase_get",
    "10dlc_brands_campaigns_list",
    "10dlc_brands_campaigns_get",
    "10dlc_brands_campaigns_create",
    "10dlc_brands_campaigns_get_get",
    "10dlc_brands_campaigns_update",
    "10dlc_brands_campaigns_delete",
    "10dlc_subscriptions_create",
    "10dlc_subscriptions_list",
    "10dlc_subscriptions_delete",
    "10dlc_brands_campaigns_numbers_create",
    "10dlc_brands_campaigns_numbers_delete",
    "10dlc_brands_campaigns_numbers_get",
    "10dlc_brands_campaigns_nudge_create"
  ],
  "Number Validator": ["validation_list", "validation_create", "validation_get"],
  "Voice campaigns": ["voice_campaigns_create", "voice_campaign_get"],
  "Link shortener": ["short_links_create", "short_links_metrics_list"],
  "2FA": [
    "two_fa_verification_create",
    "two_fa_service_sessions_get",
    "two_fa_verification_create_create",
    "two_fa_verification_check_create",
    "two_fa_verification_cancel_patch",
    "two_fa_session_events_get"
  ],
  Billing: ["billing_transactions_list", "billing_invoices_list", "billing_invoices_get"],
  Profile: ["profile_update", "profile_get", "profile_config_list"],
  "Sub-accounts": [
    "sub_organizations_list",
    "sub_organizations_create",
    "sub_organizations_get",
    "sub_organizations_update",
    "sub_organizations_billing_transactions_get"
  ]
}

/**
 * All generated MCP tools
 */
export const generatedTools: Tool[] = [
  {
    name: "sip_trunks_list",
    description:
      "List SIP trunks on the account. Use this method to list SIP trunks on your account. By default, results are paginated with 25 records per page.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "integer",
          description: "Requested page",
          format: "int32"
        },
        per_page: {
          type: "integer",
          description: "Number of records per page",
          format: "int32"
        }
      }
    }
  },
  {
    name: "sip_trunk_create",
    description: "Create a new SIP trunk. Use this method to create a new SIP trunk on your account.",
    inputSchema: {
      type: "object",
      properties: {
        label: {
          type: "string",
          description: "User-defined name of the SIP trunk"
        },
        password: {
          type: "string",
          description: "Password set for the SIP trunk. Use a strong password to help keep your SIP trunk secure."
        },
        host_request: {
          type: "object",
          description:
            "For SIP trunks with IP authentication, includes the SIP endpoint public static IP address and the status of the authentication request. Wavix authenticates all SIP traffic originating from this IP address."
        },
        callerid: {
          type: "string",
          description: "Caller ID associated with the SIP trunk. Must be an active or verified number on your account."
        },
        multiple_numbers: {
          type: "boolean",
          description:
            "Indicates whether any active or verified phone number in your account can be used as the Caller ID for the SIP trunk"
        },
        ip_restrict: {
          type: "boolean",
          description:
            "Indicates whether SIP trunk registration is allowed from only specific public static IP addresses. When set to `true`, the `allowed_ips` parameter must be provided."
        },
        allowed_ips: {
          type: "array",
          description: "A list of public static IP addresses allowed to register with the SIP trunk",
          items: {
            type: "object"
          }
        },
        didinfo_enabled: {
          type: "boolean",
          description:
            "Indicates whether inbound calls include dialed number information in the `To` header of SIP INVITE requests"
        },
        call_restrict: {
          type: "boolean",
          description: "Indicates whether a maximum call duration limit is enforced for the SIP trunk"
        },
        call_limit: {
          type: "integer",
          description:
            "A maximum call duration for the SIP trunk, in seconds. Must not exceed the maximum duration set for your account. Ignored when call_restrict is `false`.",
          format: "int32"
        },
        cost_limit: {
          type: "boolean",
          description: "Indicates if the max cost limit for an outbound call limit is activated for the SIP trunk."
        },
        max_call_cost: {
          type: "number",
          description: "Maximum cost for an outbound call, in USD",
          format: "decimal"
        },
        channels_restrict: {
          type: "boolean",
          description:
            "Indicates whether a limit on the number of concurrent outbound calls is enforced for the SIP trunk"
        },
        max_channels: {
          type: "integer",
          description:
            "Maximum number of concurrent outbound calls for the SIP trunk. Must not exceed the outbound channel capacity set for your account. Ignored when channels_restrict is `false`.",
          format: "int32"
        },
        rewrite_enabled: {
          type: "boolean",
          description: "Indicates whether a custom dial plan is activated for the SIP trunk"
        },
        rewrite_prefix: {
          type: "string",
          description: "Digits to automatically prepend to each dialed phone number"
        },
        rewrite_cond: {
          type: "string",
          description: "Number of leading digits to automatically remove from each dialed phone number"
        },
        call_recording_enabled: {
          type: "boolean",
          description: "Indicates whether outbound call recording is enabled for the SIP trunk"
        },
        transcription_enabled: {
          type: "boolean",
          description:
            "Indicates whether automatic call transcription is enabled for the SIP trunk.\nAvailable for `Flex Pro` customers only."
        },
        transcription_threshold: {
          type: "integer",
          description:
            "Transcriptions will be generated for calls that meet or exceed the specified minimal call duration threshold, in seconds.\nAvailable for `Flex Pro` customers only.",
          format: "int32"
        },
        machine_detection_enabled: {
          type: "boolean",
          description:
            "Indicates whether automatic voicemail detection is enabled for the SIP trunk.\nAvailable for `Flex Pro` customers only."
        },
        encrypted_media: {
          type: "boolean"
        }
      },
      required: [
        "label",
        "password",
        "callerid",
        "ip_restrict",
        "didinfo_enabled",
        "call_restrict",
        "cost_limit",
        "channels_restrict",
        "rewrite_enabled",
        "transcription_enabled",
        "transcription_threshold"
      ]
    }
  },
  {
    name: "sip_trunk_get",
    description: "Get a SIP trunk configuration. Use this method to get a specific SIP trunk configuration details.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "SIP trunk ID",
          format: "int32"
        }
      },
      required: ["id"]
    }
  },
  {
    name: "sip_trunk_update",
    description: "Update a SIP trunk configuration. Use this method to update a specific SIP trunk configuration.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "SIP trunk ID",
          format: "int32"
        },
        label: {
          type: "string",
          description: "User-defined name of the SIP trunk"
        },
        password: {
          type: "string",
          description: "Password set for the SIP trunk. Use a strong password to help keep your SIP trunk secure."
        },
        host_request: {
          type: "object",
          description:
            "For SIP trunks with IP authentication, includes the SIP endpoint public static IP address and the status of the authentication request. Wavix authenticates all SIP traffic originating from this IP address."
        },
        callerid: {
          type: "string",
          description: "Caller ID associated with the SIP trunk. Must be an active or verified number on your account."
        },
        multiple_numbers: {
          type: "boolean",
          description:
            "Indicates whether any active or verified phone number in your account can be used as the Caller ID for the SIP trunk"
        },
        ip_restrict: {
          type: "boolean",
          description:
            "Indicates whether SIP trunk registration is allowed from only specific public static IP addresses. When set to `true`, the `allowed_ips` parameter must be provided."
        },
        allowed_ips: {
          type: "array",
          description: "A list of public static IP addresses allowed to register with the SIP trunk",
          items: {
            type: "object"
          }
        },
        didinfo_enabled: {
          type: "boolean",
          description:
            "Indicates whether inbound calls include dialed number information in the `To` header of SIP INVITE requests"
        },
        call_restrict: {
          type: "boolean",
          description: "Indicates whether a maximum call duration limit is enforced for the SIP trunk"
        },
        call_limit: {
          type: "integer",
          description:
            "A maximum call duration for the SIP trunk, in seconds. Must not exceed the maximum duration set for your account. Ignored when call_restrict is `false`.",
          format: "int32"
        },
        cost_limit: {
          type: "boolean",
          description: "Indicates if the max cost limit for an outbound call limit is activated for the SIP trunk."
        },
        max_call_cost: {
          type: "number",
          description: "Maximum cost for an outbound call, in USD",
          format: "decimal"
        },
        channels_restrict: {
          type: "boolean",
          description:
            "Indicates whether a limit on the number of concurrent outbound calls is enforced for the SIP trunk"
        },
        max_channels: {
          type: "integer",
          description:
            "Maximum number of concurrent outbound calls for the SIP trunk. Must not exceed the outbound channel capacity set for your account. Ignored when channels_restrict is `false`.",
          format: "int32"
        },
        rewrite_enabled: {
          type: "boolean",
          description: "Indicates whether a custom dial plan is activated for the SIP trunk"
        },
        rewrite_prefix: {
          type: "string",
          description: "Digits to automatically prepend to each dialed phone number"
        },
        rewrite_cond: {
          type: "string",
          description: "Number of leading digits to automatically remove from each dialed phone number"
        },
        call_recording_enabled: {
          type: "boolean",
          description: "Indicates whether outbound call recording is enabled for the SIP trunk"
        },
        transcription_enabled: {
          type: "boolean",
          description:
            "Indicates whether automatic call transcription is enabled for the SIP trunk.\nAvailable for `Flex Pro` customers only."
        },
        transcription_threshold: {
          type: "integer",
          description:
            "Transcriptions will be generated for calls that meet or exceed the specified minimal call duration threshold, in seconds.\nAvailable for `Flex Pro` customers only.",
          format: "int32"
        },
        machine_detection_enabled: {
          type: "boolean",
          description:
            "Indicates whether automatic voicemail detection is enabled for the SIP trunk.\nAvailable for `Flex Pro` customers only."
        },
        encrypted_media: {
          type: "boolean"
        }
      },
      required: [
        "id",
        "label",
        "password",
        "callerid",
        "ip_restrict",
        "didinfo_enabled",
        "call_restrict",
        "cost_limit",
        "channels_restrict",
        "rewrite_enabled",
        "transcription_enabled",
        "transcription_threshold"
      ]
    }
  },
  {
    name: "sip_trunk_delete",
    description: "Delete a SIP trunk. Use this method to delete a SIP trunk from your account.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "SIP trunk ID",
          format: "int32"
        }
      },
      required: ["id"]
    }
  },
  {
    name: "buy_countries_list",
    description:
      "Get a list of countries. Use this method to retrieve a list of countries where phone numbers are available to purchase.",
    inputSchema: {
      type: "object",
      properties: {
        text_enabled_only: {
          type: "boolean",
          description: "Retrieve countries with text-enabled phone numbers only"
        }
      }
    }
  },
  {
    name: "buy_regions_list",
    description:
      "Get a list of regions. Use this method to retrieve a list of states or provinces for countries where `has_provinces_or_states` is `true`.",
    inputSchema: {
      type: "object",
      properties: {
        country: {
          type: "integer",
          description: "Country unique ID",
          format: "int32"
        },
        text_enabled_only: {
          type: "boolean",
          description: "Retrieves only regions that offer text-enabled numbers"
        }
      },
      required: ["country"]
    }
  },
  {
    name: "buy_cities_list",
    description:
      "Get a list of cities in a country. Use this method to retrieve a list of cities for countries where `has_provinces_or_states` is `false`.",
    inputSchema: {
      type: "object",
      properties: {
        country: {
          type: "integer",
          description: "Country ID",
          format: "int32"
        },
        text_enabled_only: {
          type: "boolean",
          description: "Retrieve only cities with text-enabled numbers"
        }
      },
      required: ["country"]
    }
  },
  {
    name: "buy_region_cities_list",
    description:
      "Get a list of cities in a region. Use this method to retrieve a list of cities for countries where `has_provinces_or_states` is `true`.",
    inputSchema: {
      type: "object",
      properties: {
        country: {
          type: "integer",
          description: "Country ID",
          format: "int32"
        },
        region: {
          type: "integer",
          description: "Region ID",
          format: "int32"
        },
        text_enabled_only: {
          type: "boolean",
          description: "Retrieve only cities with text-enabled numbers"
        }
      },
      required: ["country", "region"]
    }
  },
  {
    name: "buy_numbers_available",
    description:
      "Get numbers available for purchase. Use this method to retrieve a paginated list of phone numbers available for purchase.",
    inputSchema: {
      type: "object",
      properties: {
        country: {
          type: "integer",
          description: "Country ID",
          format: "int32"
        },
        city: {
          type: "integer",
          description: "City ID",
          format: "int32"
        },
        text_enabled_only: {
          type: "boolean",
          description: "Retrieve only text-enabled numbers"
        },
        page: {
          type: "integer",
          description: "Requested page",
          format: "int32"
        },
        per_page: {
          type: "integer",
          description: "Number of records per page",
          format: "int32"
        }
      },
      required: ["country", "city"]
    }
  },
  {
    name: "buy_cart_update",
    description:
      "Add phone numbers to the cart. Use this method to add phone numbers to the cart in your account. After adding numbers, you can complete the purchase by checking out the cart.",
    inputSchema: {
      type: "object",
      properties: {
        ids: {
          type: "array",
          description: "Comma-separated list of numbers to add to the cart",
          items: {
            type: "string"
          }
        }
      },
      required: ["ids"]
    }
  },
  {
    name: "cart_get",
    description:
      "Get cart content. Use this method to get a list of phone numbers that were previously added to the cart. This method does not require any parameters.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "cart_clear",
    description: "Remove numbers from the cart. Use this method to remove phone numbers from the cart in your account.",
    inputSchema: {
      type: "object",
      properties: {
        ids: {
          type: "array",
          description: "Comma-separated list of phone numbers to remove",
          items: {
            type: "string"
          }
        }
      }
    }
  },
  {
    name: "cart_checkout",
    description:
      "Check out numbers. Use this method to check out phone numbers currently in the cart.\n\nThe activation and monthly fee will be automatically\n deducted from your balance. Ensure you have sufficient\n  funds on your account or a primary card linked with\n   enough balance to complete the purchase.",
    inputSchema: {
      type: "object",
      properties: {
        ids: {
          type: "array",
          description: "List of phone numbers to check out from the cart",
          items: {
            type: "string"
          }
        }
      },
      required: ["ids"]
    }
  },
  {
    name: "numbers_list",
    description:
      "Get numbers on the account. Use this method to list phone numbers on your account. By default, results are paginated with 25 records per page.",
    inputSchema: {
      type: "object",
      properties: {
        city_id: {
          type: "integer",
          description: "Filter numbers by city or rate center.",
          format: "int32"
        },
        search: {
          type: "string",
          description: "Filter numbers by digits in the phone number. You can provide a full number or part of it."
        },
        label: {
          type: "string",
          description: "Filter phone numbers by label. Only exact matches are returned."
        },
        label_present: {
          type: "boolean",
          description:
            "If true, returns only phone numbers with a label. If false, returns only phone numbers without a label. When this parameter is used, the `label` parameter is ignored."
        },
        page: {
          type: "integer",
          description: "Requested page",
          format: "int32"
        },
        per_page: {
          type: "integer",
          description: "The number of records per page",
          format: "int32"
        }
      }
    }
  },
  {
    name: "numbers_bulk_delete",
    description: "Return numbers to stock. Use this method to return phone numbers to stock.",
    inputSchema: {
      type: "object",
      properties: {
        ids: {
          type: "array",
          description: "An array of phone number IDs to release from your account"
        },
        dids: {
          type: "string",
          description:
            'A comma-separated string of phone numbers to release from your account (e.g., "47832123321,47832123324,47832123325")'
        }
      }
    }
  },
  {
    name: "number_get",
    description: "Get a specific number details. Use this method to get a specific phone number details.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "Phone number ID",
          format: "int32"
        }
      },
      required: ["id"]
    }
  },
  {
    name: "mydids_update",
    description: "Update a specific number. Use this method to update a specific phone number configuration settings.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "Phone number ID",
          format: "int32"
        },
        call_recording_enabled: {
          type: "boolean",
          description: "Turn call recording on or off for the number."
        },
        transcription_enabled: {
          type: "boolean",
          description: "Turn transcription on or off for the number."
        },
        transcription_threshold: {
          type: "integer",
          description: "Transcription threshold, in seconds."
        },
        sms_relay_url: {
          type: "string",
          description:
            "SMS relay URL for the number.\n Incoming SMS and MMS messages will be sent\n  to this URL as HTTP POST requests.\n  If the number isn't SMS-enabled,\n   setting the `sms_relay_url`\n   returns the `HTTP 422 Unprocessable Content` error.\n\nTo remove inbound message routing for this number,\n set the value to `null`.\n  Messages will then be forwarded only to\n  the `sms_relay_url` configured on the account."
        },
        call_status_url: {
          type: "string",
          description:
            "Call status callback URL for the number. Status updates are sent to this URL as HTTP POST requests."
        }
      },
      required: ["id"]
    }
  },
  {
    name: "numbers_sms_update",
    description:
      "SMS-enable a specific number. Use this method to enable or disable inbound SMS support on a specific phone number.\n\n**Note**: Inbound SMS can only be activated on US and CA numbers.",
    inputSchema: {
      type: "object",
      properties: {
        sms_enabled: {
          type: "boolean",
          description: "Turn inbound SMS support on or off for the number."
        },
        id: {
          type: "integer",
          description: "Phone number ID.",
          format: "int32"
        }
      },
      required: ["sms_enabled", "id"]
    }
  },
  {
    name: "mydids_update_destinations_create",
    description:
      "Update inbound call destinations. Use this method to update inbound call routing for phone numbers. You can route calls to a SIP URI, PSTN number, or SIP trunk on the platform. This method allows you to add multiple inbound call destinations for a phone number.\n\nDestinations for several phone numbers can be updated\n with a single request.",
    inputSchema: {
      type: "object",
      properties: {
        ids: {
          type: "array",
          description: "An array of unique identifiers of DIDs to update",
          items: {
            type: "integer"
          }
        },
        destinations: {
          type: "array",
          description: "An array of inbound call destinations to be set up on the phone number",
          items: {
            type: "object"
          }
        },
        sms_relay_url: {
          type: "string",
          description: "The URL to which SMS messages will be relayed for the specified DIDs",
          format: "uri"
        }
      },
      required: ["ids", "destinations", "sms_relay_url"]
    }
  },
  {
    name: "numbers_papers_upload",
    description:
      "Upload a document for numbers. Use this method to upload a document for one or more phone numbers.\nUploaded files must meet the following requirements:\n- Allowed formats: PNG, JPG, JPEG, TIFF, BMP, or PDF\n- Maximum file size: 10 MB\n- Files can't be password protected\n- PDF files must not contain digital signatures",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "cdr_list",
    description:
      "Get CDRs on the account. Use this method to retrieve a list of CDRs for inbound and outbound calls. The records can be filtered by date, phone number, destination or call type. By default, the results are paginated, with 25 records per page.",
    inputSchema: {
      type: "object",
      properties: {
        from: {
          type: "string",
          description: "Start date of your search time range, in `yyyy-mm-dd` format",
          format: "date"
        },
        to: {
          type: "string",
          description: "End date of your search time range, in `yyyy-mm-dd` format.",
          format: "date"
        },
        type: {
          type: "string",
          description: "Use `placed` to get CDRs for outbound calls or `received` for inbound calls."
        },
        disposition: {
          type: "object",
          description:
            "Filter calls by disposition. In case the parameter is not specified, only answered calls are returned. To get all calls regardless their disposition pass `all` as the parameter value"
        },
        from_search: {
          type: "string",
          description:
            "Filter results by the originating phone number. The parameter can be either full phone number or a part of it."
        },
        to_search: {
          type: "string",
          description:
            "Filter results by destination phone number. The parameter can be either full phone number or a part of it."
        },
        sip_trunk: {
          type: "string",
          description:
            "Filter results by the unique SIP trunk login used to place an outbound call. For inbound calls, this parameter is ignored."
        },
        uuid: {
          type: "string",
          description: "Filter results by Call ID"
        },
        page: {
          type: "integer",
          description: "Requested page",
          format: "int32"
        },
        per_page: {
          type: "integer",
          description: "Number of records per page",
          format: "int32"
        }
      },
      required: ["from", "to", "type"]
    }
  },
  {
    name: "cdr_export",
    description:
      "Search for calls containing specific keywords or phrases. Use this method to search for call transcriptions containing specific keywords or phrases. Wavix automatically labels speakers as an agent and a customer based on the call direction. You can search for phrases said by an agent, a customer, or both.\n\nBy default, the results are paginated, with 25 records per page.",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          description:
            "Mandatory parameter. Use `placed` to search in the outbound call transcriptions or `received` to search in the inbound call transcriptions."
        },
        from: {
          type: "string",
          description:
            "Mandatory parameter. Filter results by the lower limit on the date the call was placed or received. Has the following format `yyyy-mm-dd`",
          format: "date"
        },
        to: {
          type: "string",
          description:
            "Mandatory parameter. Filter results by the upper limit on the date the call was placed or received. Has the following format `yyyy-mm-dd`",
          format: "date"
        },
        from_search: {
          type: "string",
          description:
            "Filter results by the originating phone number. The parameter can be either a full phone number or a part of it."
        },
        to_search: {
          type: "string",
          description:
            "Filter results by destination phone number. The parameter can be either a full phone number or a part of it."
        },
        sip_trunk: {
          type: "string",
          description:
            "Filter results by the unique SIP trunk ID used to place an outbound call. For inbound calls the parameter is ignored."
        },
        min_duration: {
          type: "integer",
          description: "Filter results by minimum call duration, in seconds",
          format: "int32"
        },
        transcription: {
          type: "object"
        },
        uuid: {
          type: "string",
          description: "Call ID"
        },
        disposition: {
          type: "object"
        },
        page: {
          type: "integer",
          description: "Requested page",
          format: "int32"
        },
        per_page: {
          type: "integer",
          description: "Number of records per page",
          format: "int32"
        }
      },
      required: ["type", "from", "to", "page", "per_page"]
    }
  },
  {
    name: "cdr_retranscribe_update",
    description:
      'Transcribe a single call. Use this method to submit a specific call recording for transcription.\n\nThe processing time depends on the call length and the number\n of recordings in the queue.  Most calls are transcribed within\n  10 minutes. To receive a notification when the transcription\n   completed, provide a webhook address in the `webhook_url` parameter.\n    Wavix will send a status update to this address.\n\n\nThe method responses with the `HTTP 200 OK` status code and no content.\n After the transcription is completed, the service sends\n  a POST callback to the specified webhook:\n\n```json\n  {\n   "uuid": "123",\n   "status": "completed"\n  }\n```\n- uuid - the unique identifier of the recorded call\n- status - status of the operation. Can be either `completed`\n indicating the recorded call was successfully transcribed or\n  `failed` which indicates that there was an error\n   while transcribing the call.',
    inputSchema: {
      type: "object",
      properties: {
        cdr_uuid: {
          type: "string",
          description: "Unique identifier of a call"
        },
        language: {
          type: "string",
          description: "Transcription language",
          enum: ["en", "de", "es", "fr", "it"]
        },
        webhook_url: {
          type: "string",
          description: "Webhook URL to send status update to"
        }
      },
      required: ["cdr_uuid"]
    }
  },
  {
    name: "cdr_transcription_get",
    description:
      "Request transcription for a specific call. Use this method to retrieve transcription for a specific recorded call.\n\nThe response contains a JSON object with an array of `turn` objects.\nEach `turn` contains:\n- The text spoken by a particular speaker\n- The start and end times for that text, calculated from the moment the call was answered\n\nFor convenience, the response also provides the full text for each speaker.",
    inputSchema: {
      type: "object",
      properties: {
        cdr_uuid: {
          type: "string",
          description: "Unique identifier of a call"
        }
      },
      required: ["cdr_uuid"]
    }
  },
  {
    name: "cdr_get",
    description:
      "Get details of a specific call. Use this method to retrieve specific outbound or inbound call details.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Unique identifier of a call"
        },
        show_transcription: {
          type: "boolean",
          description: "Include transcription information in the response"
        }
      },
      required: ["uuid"]
    }
  },
  {
    name: "cdr_list_all",
    description:
      "Get CDRs in NDJSON format. Use this method to retrieve Call Detail Records (CDRs) in Newline-Delimeted JSON (NDJSON) format. Useful for bulk data export.",
    inputSchema: {
      type: "object",
      properties: {
        from: {
          type: "string",
          description: "Start date of your search time range, in `yyyy-mm-dd` format",
          format: "date"
        },
        to: {
          type: "string",
          description: "End date of your search time range, in `yyyy-mm-dd` format.",
          format: "date"
        },
        type: {
          type: "string",
          description: "Use `placed` to get CDRs for outbound calls or `received` for inbound calls."
        },
        disposition: {
          type: "object",
          description:
            "Filter calls by disposition. In case the parameter is not specified, only answered calls are returned. To get all calls regardless their disposition pass `all` as the parameter value"
        },
        from_search: {
          type: "string",
          description:
            "Filter results by the originating phone number. The parameter can be either full phone number or a part of it."
        },
        to_search: {
          type: "string",
          description:
            "Filter results by destination phone number. The parameter can be either full phone number or a part of it."
        },
        sip_trunk: {
          type: "string",
          description:
            "Filter results by the unique SIP trunk login used to place an outbound call. For inbound calls, this parameter is ignored."
        },
        uuid: {
          type: "string",
          description: "Filter results by Call ID"
        },
        page: {
          type: "integer",
          description: "Requested page",
          format: "int32"
        },
        per_page: {
          type: "integer",
          description: "Number of records per page",
          format: "int32"
        }
      },
      required: ["from", "to", "type"]
    }
  },
  {
    name: "recordings_list",
    description:
      "List call recordings. Use this method to retrieve a list of call recordings. By default, the results are paginated, with 25 records per page.",
    inputSchema: {
      type: "object",
      properties: {
        from_date: {
          type: "string",
          description: "Start date of your search time range, in `yyyy-mm-dd` format.",
          format: "date"
        },
        to_date: {
          type: "string",
          description: "End date of your search time range, in `yyyy-mm-dd` format.",
          format: "date"
        },
        from: {
          type: "string",
          description: "Filter results by Caller ID."
        },
        to: {
          type: "string",
          description:
            "Filter results by destination phone number. The parameter can be either full phone number or a part of it."
        },
        call_uuid: {
          type: "string",
          description: "Filter results by call ID."
        },
        sip_trunks: {
          type: "array",
          description: "Filter results by SIP trunk IDs."
        },
        dids: {
          type: "array",
          description: "Filter results by DIDs"
        }
      }
    }
  },
  {
    name: "recording_get_by_cdr",
    description: "Get a specific call recording. Use this method to retrieve a specific call recording.",
    inputSchema: {
      type: "object",
      properties: {
        cdr_uuid: {
          type: "string",
          description: "Call ID."
        }
      },
      required: ["cdr_uuid"]
    }
  },
  {
    name: "recordings_delete",
    description: "Delete a specific recording. Use this method to delete a specific recording.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "Call recording ID",
          format: "int32"
        }
      },
      required: ["id"]
    }
  },
  {
    name: "speech_analytics_create",
    description:
      'Upload a file for transcription. Use this method to upload a file and submit it for transcription. When the transcription is completed, Wavix sends a POST callback to the webhook specified in the request.\n\n Callback example:\n   ```json\n   {\n        "request_id": "e865ea07-25af-4fdd-876e-04b0d41d5ebd",\n        "status": "completed",\n        "error": null\n      }\n   ```\n  - request_id - the unique identifier of the transcription request\n  - status - status of the operation. Can be either `completed` indicating the file was successfully transcribed or `failed` which indicates that there was an error while transcribing the file.\n  - error - in case the transcription failed, this field contains a description of the error that occurred. If the transcription was successful, this field is null.',
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "speech_analytics_get",
    description: "Query a specific transcription. Use this method to retrieve a specific file transcription.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Transcription request ID"
        }
      },
      required: ["uuid"]
    }
  },
  {
    name: "speech_analytics_update",
    description: "Retranscribe an uploaded file. Use this method to retranscribe an uploaded audio file.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Unique identifier of the transcription request"
        },
        callback_url: {
          type: "string",
          description: "Webhook URL where transcription status updates are sent"
        },
        insights: {
          type: "boolean",
          description: "Enable insights generation for the transcription"
        }
      },
      required: ["uuid", "callback_url"]
    }
  },
  {
    name: "speech_analytics_file_download",
    description:
      "Retrieve the original file. Use this method to retrieve the original file that was submitted for transcription.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Unique identifier of the transcription request"
        }
      },
      required: ["uuid"]
    }
  },
  {
    name: "call_webhooks_get",
    description:
      "List configured webhooks. Use this method to retrieve a list of configured call webhooks.\n\nWavix sends POST callbacks to your webhook URL for on-call and post-call events.\n- The `on-call` callback includes real-time call status updates. It's triggered when a call is initiated, answered, and ends.\n- The `post-call` callback includes details such as call disposition, duration, and cost. It's triggered after the call ends.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "call_webhooks_create",
    description:
      "Create a webhook. Use this method to create a call webhook.\n\nWavix sends POST callbacks to your webhook URL for on-call and post-call events.\n- Use `on-call` webhook to receive real-time call status updates. It's triggered when a call is initiated, answered, and ends.\n- The `post-call` webhook is triggered after the call ends. The callback includes details such as call disposition, duration, and cost.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "Webhook URL to send call events to.",
          format: "uri"
        },
        event_type: {
          type: "string",
          description:
            "Use `on-call` to receive real-time status updates. Callbacks are sent when the call is initiated, answered, and ended.\nUse `post-call` to receive a callback after the call ends. The callback includes details such as call disposition, duration, and cost.",
          enum: ["post-call", "on-call"]
        }
      },
      required: ["url", "event_type"]
    }
  },
  {
    name: "call_webhooks_delete",
    description: "Delete a webhook. Use this method to delete a call webhook configuration.",
    inputSchema: {
      type: "object",
      properties: {
        event_type: {
          type: "string",
          description: "Type of call events webhook to delete",
          enum: ["post-call", "on-call"]
        }
      },
      required: ["event_type"]
    }
  },
  {
    name: "call_create",
    description: "Start a new call. Use this method to start a new outbound call.",
    inputSchema: {
      type: "object",
      properties: {
        from: {
          type: "string",
          description: "Caller ID. Must be an active or verified phone number in your account."
        },
        to: {
          type: "string",
          description: "Destination number in E.164 format"
        },
        status_callback: {
          type: "string",
          description: "Webhook URL to receive call status updates"
        },
        call_recording: {
          type: "boolean",
          description: "Specifies whether to record the call"
        },
        machine_detection: {
          type: "boolean",
          description: "Specifies whether the AMD is turned on for the call"
        },
        tag: {
          type: "string",
          description: "Call metadata"
        },
        max_duration: {
          type: "integer",
          description: "Maximum call duration, in seconds"
        }
      },
      required: ["from", "to"]
    }
  },
  {
    name: "calls_list",
    description: "Fetch active calls. Use this method to retrieve all active calls on your account.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "call_get",
    description: "Get a specific call details. Use this method to retrieve a specific call details.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Call ID.",
          format: "uuid"
        }
      },
      required: ["uuid"]
    }
  },
  {
    name: "call_hangup",
    description: "End a call. Use this method to end an active call.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Call ID.",
          format: "uuid"
        }
      },
      required: ["uuid"]
    }
  },
  {
    name: "call_answer",
    description:
      'Answer an inbound call. Use this method to programmatically answer an inbound call. Make sure you\'ve configured the inbound call webhook on a number using [API](/api-reference/my-numbers/update-a-specific-number) or GUI. If configured, Wavix posts call status updates to the webhook associated with the number.\n\nOptionally, you can immediately start call media streaming when the inbound call is answered. To start streaming, paste the following JSON in the request body. Wavix will start media streaming to a WebSocket URL specified in the request.\n```json\n{\n  "stream_channel": "inbound",\n  "stream_type": "twoway",\n  "stream_url": "wss://your-websocket-server-url-and-port"\n}\n```',
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Call ID.",
          format: "uuid"
        },
        call_recording: {
          type: "boolean",
          description: "Indicates whether the call should be recorded"
        },
        call_transcription: {
          type: "boolean",
          description: "Indicates whether the call is transcribed after it ends"
        },
        stream_url: {
          type: "string",
          description: "WebSocket URL for call streaming",
          format: "uri"
        },
        stream_type: {
          type: "string",
          description:
            "Specifies the streaming type. Can be either `oneway` for unidirectional or `twoway` for bidirectional streaming.",
          enum: ["oneway", "twoway"]
        },
        stream_channel: {
          type: "string",
          description:
            "Specifies which audio channel to stream.\nUse `inbound` to stream the incoming channel (to Wavix), `outbound` for the outbound channel (from Wavix), or `both` to stream both.\nFor bidirectional call streaming, this setting is ignored and the inbound channel is only streamed.",
          enum: ["inbound", "outbound", "both"]
        }
      },
      required: ["uuid"]
    }
  },
  {
    name: "call_stream_start",
    description:
      "Start call streaming. Use this method to start call streaming.\n Wavix Call Media Streaming allows you to stream inbound (to Wavix),\n  outbound (from Wavix), or both channels.\n   Wavix also supports unidirectional streaming when your WebSocket\n    only receives media from the platform, and bi-directional\nstreaming when your WebSocket can send back audio and commands to Wavix.\n\n**Note**. You can have up to 5 unidirectional streams for a call.\n Only one bi-directional stream can be created.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Call ID.",
          format: "uuid"
        },
        stream_url: {
          type: "string",
          description: "WebSocket URL for call streaming",
          format: "uri"
        },
        stream_type: {
          type: "string",
          description:
            "Specifies the streaming type. Can be either `oneway` for unidirectional or `twoway` for bidirectional streaming.",
          enum: ["oneway", "twoway"]
        },
        stream_channel: {
          type: "string",
          description:
            "Specifies which audio channel to stream.\nUse `inbound` to stream the incoming channel (to Wavix), `outbound` for the outbound channel (from Wavix), or `both` to stream both.\nFor bidirectional call streaming, this setting is ignored and the inbound channel is only streamed.",
          enum: ["inbound", "outbound", "both"]
        }
      },
      required: ["uuid", "stream_url", "stream_type", "stream_channel"]
    }
  },
  {
    name: "call_stream_stop",
    description: "Stop call streaming. Use this method to stop call media streaming.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Call ID.",
          format: "uuid"
        },
        stream_uuid: {
          type: "string",
          description: "Stream ID.",
          format: "uuid"
        }
      },
      required: ["uuid", "stream_uuid"]
    }
  },
  {
    name: "call_play",
    description: "Play audio during a call. Use this method to play an audio in an active call.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Call ID.",
          format: "uuid"
        },
        audio_file: {
          type: "string",
          description: "URL of the audio file to play"
        },
        delay_before_playing: {
          type: "integer",
          description: "Delay before playing the audio, in milliseconds"
        }
      },
      required: ["uuid", "audio_file"]
    }
  },
  {
    name: "call_audio_delete",
    description: "Stop audio playback. Use this method to stop audio that's currently playing in an active call.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Call ID.",
          format: "uuid"
        }
      },
      required: ["uuid"]
    }
  },
  {
    name: "call_dtmf_collect",
    description:
      "Collect DTMF input. Use this method to collect DTMF (dual-tone multi-frequency) input in an active call.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Call ID.",
          format: "uuid"
        },
        min_digits: {
          type: "integer",
          description: "Specifies the minimum number of digits to collect"
        },
        max_digits: {
          type: "integer",
          description: "Specifies the maximum number of digits to collect"
        },
        timeout: {
          type: "integer",
          description: "Timeout for digit collection, in seconds"
        },
        termination_character: {
          type: "string",
          description: "Character that ends digit collection"
        },
        audio: {
          type: "object"
        },
        callback_url: {
          type: "string",
          description: "URL to receive digit collection results"
        }
      },
      required: ["uuid"]
    }
  },
  {
    name: "webrtc_token_create",
    description:
      "Generate a Wavix Embeddable Widget token. Use this method to generate a Wavix Embeddable Widget token for SIP trunk integration.",
    inputSchema: {
      type: "object",
      properties: {
        sip_trunk: {
          type: "string",
          description: "SIP trunk name"
        },
        payload: {
          type: "object",
          description: "Arbitrary data to be associated with the token"
        },
        ttl: {
          type: "integer",
          description: "Time to live in seconds"
        }
      },
      required: ["sip_trunk"]
    }
  },
  {
    name: "webrtc_tokens_list",
    description:
      "Get active widget tokens. Use this method to list all active Wavix Embeddable widget tokens on your account. By default, results are paginated with 25 items per page.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "webrtc_token_get",
    description:
      "Get a Wavix Embeddable Widget token. Use this method to get detailed information about a specific Wavix Embeddable Widget token.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Token ID.",
          format: "uuid"
        }
      },
      required: ["uuid"]
    }
  },
  {
    name: "webrtc_token_update",
    description:
      "Update a widget token payload. Use this method to update the payload associated with a Wavix Embeddable Widget token. This method updates the payload only. The existing payload linked to the token is replaced with the new one.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Token ID",
          format: "uuid"
        },
        payload: {
          type: "object",
          description: "Arbitrary data to be associated with the token"
        }
      },
      required: ["uuid", "payload"]
    }
  },
  {
    name: "webrtc_token_delete",
    description:
      "Delete a Wavix Embeddable Widget token. Use this method to delete a Wavix Embeddable Widget token. After deletion, the token can't be used to authenticate widget sessions, and any active session associated with it will be terminated.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Token ID",
          format: "uuid"
        }
      },
      required: ["uuid"]
    }
  },
  {
    name: "sms_sender_ids_list",
    description: "List Sender IDs. Use this method to get a list of all Sender IDs and their details.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "sms_sender_id_create",
    description:
      "Create a new Sender ID. Use this method to create a new Sender ID.\\After you create the sender ID, wait for it to be allowlisted for the destination countries. To check the status, use the [Get a sender ID](https://wavix.com) method.\n\n**Important** To create Sender IDs in the US, use the 10DLC API.",
    inputSchema: {
      type: "object",
      properties: {
        sender_id: {
          type: "string",
          description: "Name of the Sender ID. Can be either an alphanumeric string or a phone number on the account."
        },
        type: {
          type: "string",
          description: "Sender ID type",
          enum: ["numeric", "alphanumeric"]
        },
        countries: {
          type: "array",
          description: "An array of 2 letter ISO codes of the countries the Sender ID to be allow listed in",
          items: {
            type: "string"
          }
        },
        usecase: {
          type: "string",
          description: "Use case for the Sender ID",
          enum: ["transactional", "promo", "authentication"]
        },
        monthly_volume: {
          type: "string",
          description: "Expected monthly volume",
          enum: ["1-1000", "1001-20000", "20001-50000", "50001-100000", "More than 100000"]
        },
        samples: {
          type: "array",
          description: "Sample messages for the Sender ID",
          items: {
            type: "string"
          }
        }
      },
      required: ["sender_id", "type", "countries", "usecase"]
    }
  },
  {
    name: "sms_sender_id_get",
    description: "Get a Sender ID. Use this method to retrieve details of a specific Sender ID.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Unique identifier of a Sender ID",
          format: "uuid"
        }
      },
      required: ["id"]
    }
  },
  {
    name: "sms_sender_id_delete",
    description:
      "Delete a Sender ID. Use this method to delete a Sender ID.\n\n**Important** Use carefully. Deleting a Sender ID is irreversible. Any attempts to send messages carrying the deleted Sender ID will fail.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Unique identifier of the Sender ID to delete"
        }
      },
      required: ["id"]
    }
  },
  {
    name: "sms_opt_out_add",
    description:
      "Unsubscribe a phone number from SMS messages. Use this method to opt out a phone number from receiving SMS and MMS messages.\n\nYou can either:\n - Opt out a phone number for a specific Sender ID.\n - Block all outbound messages sent to the phone number.",
    inputSchema: {
      type: "object",
      properties: {
        opt_out: {
          type: "object"
        }
      },
      required: ["opt_out"]
    }
  },
  {
    name: "sms_send",
    description:
      "Send SMS or MMS message. Send SMS or MMS messages to your users. SMS messages can use any numeric or alphanumeric Sender ID registered in Wavix. MMS messages are available for U.S. numbers only and require a 10-digit numeric or toll-free Sender ID. Specify a `callback_url` to receive delivery reports when messages reach their destination.\n**Rate limit**: You can send up to 20 messages per phone number in 24 hours.",
    inputSchema: {
      type: "object",
      properties: {
        from: {
          type: "string",
          description: "Sender ID registered on your account. Can be numeric or alphanumeric."
        },
        to: {
          type: "string",
          description: "Destination phone number"
        },
        message_body: {
          type: "object"
        },
        callback_url: {
          type: "string",
          description: "Callback URL for delivery reports."
        },
        validity: {
          type: "integer",
          description:
            "Validity period of the message, in seconds. The platform stops sending the message after the validity period expires.",
          format: "int32"
        },
        tag: {
          type: "string",
          description:
            "An optional field normally used to identify a group of SMS, e.g. messages associated with a certain campaign."
        }
      },
      required: ["from", "to", "message_body"]
    }
  },
  {
    name: "sms_list",
    description:
      "Get messages on your account. Use this method to retrieve outbound and inbound SMS or MMS. Messages can be filtered by date, originating (Sender ID), destination phone numbers, or message `tag`.\n\nBy default, the results are paginated with 25 records per page.",
    inputSchema: {
      type: "object",
      properties: {
        sent_after: {
          type: "string",
          description: "Start date of your search time range, in `yyyy-mm-dd` format."
        },
        sent_before: {
          type: "string",
          description: "End date of your search time range, in `yyyy-mm-dd` format."
        },
        type: {
          type: "string",
          description: "Filter messages by the direction of the traffic, i.e. `inbound` or `outbound`"
        },
        from: {
          type: "string",
          description:
            "Filter messages by SMS sender. For `outbound` message contains a Sender ID used to sent the message, for `inbound` message contains a phone number originated the message."
        },
        to: {
          type: "string",
          description:
            "Filter messages by destination phone number. For `outbound` message contains phone number the message was sent to, for `inbound` message contains a SMS-enabled DID on the Wavix platform."
        },
        status: {
          type: "object",
          description: "Filter messages by message delivery status."
        },
        tag: {
          type: "string",
          description:
            "Filter messages by `tag`. For outbound SMS and MMS messages only, for inbound messages the parameter is ignored."
        },
        message_type: {
          type: "string",
          description: "Filter messages by message type (SMS or MMS)",
          enum: ["sms", "mms"]
        },
        page: {
          type: "integer",
          description: "Requested page",
          format: "int32"
        },
        per_page: {
          type: "integer",
          description: "Number of records per page",
          format: "int32"
        }
      },
      required: ["type"]
    }
  },
  {
    name: "sms_get",
    description: "Get a specific message. Use this method to retrieve a specific SMS or MMS message details.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Unique identifier of the message"
        }
      },
      required: ["id"]
    }
  },
  {
    name: "sms_list_all",
    description:
      "Get messages in NDJSON format. Use this method to retrieve outbound and inbound SMS or MMS messages in Newline-Delimited JSON (NDJSON) format. Useful for bulk data export.",
    inputSchema: {
      type: "object",
      properties: {
        sent_after: {
          type: "string",
          description: "Start date of your search time range, in `yyyy-mm-dd HH:MM:SS` format."
        },
        sent_before: {
          type: "string",
          description: "End date of your search time range, in `yyyy-mm-dd HH:MM:SS` format."
        },
        type: {
          type: "string",
          description: "Filter messages by the direction of SMS traffic, i.e. `inbound` or `outbound`"
        },
        from: {
          type: "string",
          description:
            "Filter messages by SMS sender. For `outbound` message contains a Sender ID used to sent the message, for `inbound` message contains a phone number originated the message."
        },
        to: {
          type: "string",
          description:
            "Filter messages by destination phone number. For `outbound` message contains phone number the message was sent to, for `inbound` message contains a SMS-enabled DID on the Wavix platform."
        },
        status: {
          type: "object",
          description: "Filter messages by message delivery status."
        },
        tag: {
          type: "string",
          description:
            "Filter messages by tag. For outbound SMS and MMS messages only, for inbound messages the parameter is ignored."
        },
        message_type: {
          type: "string",
          description: "Filter messages by message type (sms or mms)",
          enum: ["sms", "mms"]
        }
      },
      required: ["type"]
    }
  },
  {
    name: "tcr_brands_list",
    description:
      "List 10DLC Brands on your account. Use this method to query a list of 10DLC Brands on your account. The results can be filtered by date, brand name, company legal name, and status.\n\nBy default, the results are paginated, with 25 records per page.\n\nThe response contains a paginated list of Brand objects that match the search criteria.",
    inputSchema: {
      type: "object",
      properties: {
        dba_name: {
          type: "string",
          description: "Filter results by the brand name"
        },
        company_name: {
          type: "string",
          description: "Filter results by the company legal name"
        },
        entity_type: {
          type: "string",
          description: "Filter results by the business entity type"
        },
        status: {
          type: "string",
          description: "Filter results by Brand Identity verification status"
        },
        country: {
          type: "string",
          description: "Filter results by a Brand’s registration country"
        },
        show_deleted: {
          type: "boolean",
          description:
            "Use `true` to query active and deleted brands. By default, the deleted Brands are excluded from the results."
        },
        ein_taxid: {
          type: "string",
          description: "ein_taxid"
        },
        mock: {
          type: "boolean",
          description: "Use `true` to query the mock Brands on your account only"
        },
        created_before: {
          type: "string",
          description:
            "Filter results by specifying the end date for the Brand creation date range in the `yyyy-mm-dd` format"
        },
        created_after: {
          type: "string",
          description:
            "Filter results by specifying the start date for the Brand creation date range in the `yyyy-mm-dd` format"
        },
        page: {
          type: "integer",
          description: "The page number",
          format: "int32"
        },
        per_page: {
          type: "integer",
          description: "The number of records per page",
          format: "int32"
        }
      }
    }
  },
  {
    name: "tcr_brand_create",
    description:
      "Register a 10DLC Brand. Use this method to register a new 10DLC Brand on your account.\n\nUpon completing the Brand registration request, each Brand will automatically undergo an Identity Verification process. During this process, TCR verifies the EIN, legal company name, and legal company address against third-party independent sources and confirms the Brand's existence by assigning an 'Identity Status.'\n\n**NOTE** Identity Verification is a crucial step for every registered Brand. Ensure that the information provided is accurate and up-to-date to facilitate prompt verification.\n\nOnly Brands with an 'Identity Status' of `VERIFIED` or `VETTED_VERIFIED` are eligible to register 10DLC Campaigns.",
    inputSchema: {
      type: "object",
      properties: {
        dba_name: {
          type: "string",
          description: "Brand name or DBA"
        },
        company_name: {
          type: "string",
          description: "Legal name of the company"
        },
        entity_type: {
          type: "string",
          description: "The company entity type",
          enum: ["PRIVATE_PROFIT", "PUBLIC_PROFIT", "NON_PROFIT", "GOVERNMENT"]
        },
        vertical: {
          type: "string",
          description: "The segment the business operates in",
          enum: [
            "HEALTHCARE",
            "PROFESSIONAL",
            "RETAIL",
            "TECHNOLOGY",
            "EDUCATION",
            "FINANCIAL",
            "NON_PROFIT",
            "GOVERNMENT",
            "OTHER"
          ]
        },
        ein_taxid: {
          type: "string",
          description:
            "IRS Employee Identification Number (EIN) for US-based or foreign companies with EIN. The numeric portion of Tax ID for companies incorporated in other countries."
        },
        ein_taxid_country: {
          type: "string",
          description: "2-letter ISO country code of the Tax ID issuing country"
        },
        website: {
          type: "string",
          description: "The website of the business"
        },
        stock_symbol: {
          type: "string",
          description: "The stock symbol of the Brand. For PUBLIC_PROFIT Brands only."
        },
        stock_exchange: {
          type: "string",
          description: "The stock exchange code. For PUBLIC_PROFIT Brands only."
        },
        first_name: {
          type: "string",
          description: "The first name of the business contact"
        },
        last_name: {
          type: "string",
          description: "The last name of the business contact"
        },
        phone_number: {
          type: "string",
          description: "The support contact telephone in E.164 format"
        },
        email: {
          type: "string",
          description: "The email address of the support contact",
          format: "email"
        },
        street_address: {
          type: "string",
          description: "Street name and house number"
        },
        city: {
          type: "string",
          description: "The city name"
        },
        state_or_province: {
          type: "string",
          description: "State or province. For the United States, use 2 character codes."
        },
        zip: {
          type: "string",
          description: "The business zip or postal code"
        },
        country: {
          type: "string",
          description: "2-letter ISO country code the business address"
        },
        mock: {
          type: "boolean",
          description:
            "Indicates a mock Brand. You can create mock Brands for testing purposes only, production traffic with the mock Brands is prohibited."
        }
      },
      required: [
        "dba_name",
        "company_name",
        "entity_type",
        "vertical",
        "ein_taxid",
        "ein_taxid_country",
        "first_name",
        "last_name",
        "phone_number",
        "email",
        "street_address",
        "city",
        "state_or_province",
        "country",
        "zip"
      ]
    }
  },
  {
    name: "tcr_brand_get",
    description:
      "Query a specific 10DLC Brand on your account. Use this method to query specific 10DLC Brands on your account.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        }
      },
      required: ["brand_id"]
    }
  },
  {
    name: "tcr_brand_update",
    description:
      "Update a 10DLC Brand. Use this method to update the details of a registered 10DLC Brand. Please note that Brands in the 'REVIEW' status cannot be updated.\n\n**Important.** Updating any of the following parameters — `company_name`, `ein_taxid`, `ein_taxid_country`, or `entity_type` — will reset the Brand status to 'UNVERIFIED,' and the Brand will be automatically re-submitted for verification. These parameters cannot be updated for Brands with a 'VETTED_VERIFIED' identity status or Brands with active Campaigns.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        dba_name: {
          type: "string",
          description: "Brand name or DBA"
        },
        company_name: {
          type: "string",
          description: "Legal name of the company"
        },
        entity_type: {
          type: "string",
          description: "The company entity type",
          enum: ["PRIVATE_PROFIT", "PUBLIC_PROFIT", "NON_PROFIT", "GOVERNMENT"]
        },
        vertical: {
          type: "string",
          description: "The segment the business operates in",
          enum: [
            "HEALTHCARE",
            "PROFESSIONAL",
            "RETAIL",
            "TECHNOLOGY",
            "EDUCATION",
            "FINANCIAL",
            "NON_PROFIT",
            "GOVERNMENT",
            "OTHER"
          ]
        },
        ein_taxid: {
          type: "string",
          description:
            "IRS Employee Identification Number (EIN) for US-based or foreign companies with EIN. The numeric portion of Tax ID for companies incorporated in other countries."
        },
        ein_taxid_country: {
          type: "string",
          description: "2-letter ISO country code of the Tax ID issuing country"
        },
        website: {
          type: "string",
          description: "The website of the business"
        },
        stock_symbol: {
          type: "string",
          description: "The stock symbol of the Brand. For PUBLIC_PROFIT Brands only."
        },
        stock_exchange: {
          type: "string",
          description: "The stock exchange code. For PUBLIC_PROFIT Brands only."
        },
        first_name: {
          type: "string",
          description: "The first name of the business contact"
        },
        last_name: {
          type: "string",
          description: "The last name of the business contact"
        },
        phone_number: {
          type: "string",
          description: "The support contact telephone in E.164 format"
        },
        email: {
          type: "string",
          description: "The email address of the support contact",
          format: "email"
        },
        street_address: {
          type: "string",
          description: "Street name and house number"
        },
        city: {
          type: "string",
          description: "The city name"
        },
        state_or_province: {
          type: "string",
          description: "State or province. For the United States, use 2 character codes."
        },
        zip: {
          type: "string",
          description: "The business zip or postal code"
        },
        country: {
          type: "string",
          description: "2-letter ISO country code the business address"
        },
        mock: {
          type: "boolean",
          description: "Mock flag for testing (optional, defaults to false)"
        }
      },
      required: ["brand_id"]
    }
  },
  {
    name: "tcr_brand_delete",
    description:
      "Delete a 10DLC Brand. Use this method to delete a 10DLC Brand. Brands with active Campaigns cannot be deleted. You must delete Campaigns first.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        }
      },
      required: ["brand_id"]
    }
  },
  {
    name: "tcr_brand_appeal_create",
    description:
      "Appeal a 10DLC Brand Identity verification. Use this method to appeal a 10DLC Brand Identity verification.\n\nYou may need to provide any additional documentation you have for the Brand.\n\nThe following appeal categories are allowed:\n - **VERIFY_TAX_ID** - Use this category if the Brand is UNVERIFIED due to an inability to match the tax ID. Private companies, public companies, non-profit organizations, and Government Brands may submit this appeal category.\n- **VERIFY_NON_PROFIT** - Use this category if the Brand was submitted as a Non-Profit Organization is UNVERIFIED or VERIFIED and is missing a “Tax Exempt Status”.\n - **VERIFY_GOVERNMENT** - Select this category if the record submitted as a Government entity type is UNVERIFIED or VERIFIED and is missing a “Government Entity” status.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of the Brand"
        },
        appeal_categories: {
          type: "array",
          description:
            "The list of appeal categories. The allowed appeal categories are: `VERIFY_TAX_ID`, `VERIFY_NON_PROFIT`, and `VERIFY_GOVERNMENT`",
          items: {
            type: "string"
          }
        },
        evidence: {
          type: "array",
          description: "An array of evidence UUIDs to be associated with the appeal",
          items: {
            type: "string"
          }
        },
        explanation: {
          type: "string",
          description: "The appeal comment or justification"
        }
      },
      required: ["brand_id", "appeal_categories", "evidence"]
    }
  },
  {
    name: "tcr_brand_appeals_list",
    description:
      "List a 10DLC Brand Identity verification appeals. Use this method to retrieve a list of Brand Identity verification appeals.\n\nThe response will include a list of appeal objects, each detailing the status of the appeal and its outcome.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        }
      },
      required: ["brand_id"]
    }
  },
  {
    name: "tcr_evidence_upload",
    description:
      "Upload a 10DLC Brand evidence. Use this method to upload a 10DLC Brand evidence. Wavix supports supports file uploads in the following formats: .jpg, .jpeg, .png, .bmp, .raw, .tiff, .pdf, .docx, .htm, .odt, .rtf, .txt, and .xml. The file size must be less than 10MB.\n\nThe uploaded evidence can be used to appeal the Brand Identity status and Brand vetting.\n\nThe response contains the uploaded evidence details and its UUID.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        }
      },
      required: ["brand_id"]
    }
  },
  {
    name: "tcr_evidence_list",
    description:
      "List a 10DLC Brand appeal evidence. Use this method to list previously uploaded Brand appeal evidence.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        }
      },
      required: ["brand_id"]
    }
  },
  {
    name: "tcr_evidence_get",
    description:
      "Download a specific 10DLC Brand appeal evidence. Use this method to download a specific 10DLC Brand appeal evidence.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        uuid: {
          type: "string",
          description: "Evidence UUID"
        }
      },
      required: ["brand_id", "uuid"]
    }
  },
  {
    name: "tcr_evidence_delete",
    description:
      "Delete a 10DLC Brand appeal evidence. Use this method to delete a specific 10DLC Brand appeal evidence.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        uuid: {
          type: "string",
          description: "Evidence UUID"
        }
      },
      required: ["brand_id", "uuid"]
    }
  },
  {
    name: "tcr_vetting_create",
    description:
      "Request external vetting for a 10DLC Brand. Use this method to request external vetting for a 10DLC Brand.\n\nThe following external vetting providers' codes are supported:\n - **AEGIS** - The Aegis Mobile, the default external vetting provider.\n- **CV** - The Campaign Verify.\n - **WMC** - WMC Global.\n\n\nWavix supports the following vetting classes:\n - **STANDARD**\n- **STANDARD**\n - **ENHANCED**",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        evp_id: {
          type: "string",
          description: "External vetting provider code"
        },
        vetting_class: {
          type: "string",
          description: "The vetting class"
        }
      },
      required: ["brand_id", "evp_id", "vetting_class"]
    }
  },
  {
    name: "10dlc_brands_vettings_update",
    description:
      "Import an external vetting for a 10DLC Brand. Use this method to import an existing external vetting for a 10DLC Brand.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        evp_id: {
          type: "string",
          description: "External vetting provider code"
        },
        vetting_id: {
          type: "string",
          description: "Unique identifier of the vetting request"
        },
        vetting_token: {
          type: "string",
          description: "Unique vetting token"
        }
      },
      required: ["brand_id", "evp_id", "vetting_id", "vetting_token"]
    }
  },
  {
    name: "tcr_vettings_list",
    description:
      "List 10DLC Brand external vettings. Use this method to list external vettings associated with a 10DLC Brand.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        }
      },
      required: ["brand_id"]
    }
  },
  {
    name: "tcr_vetting_appeal_create",
    description: "Appeal an external vetting for a 10DLC Brand. Use this method to appeal a Brand’s external vetting.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        appeal_categories: {
          type: "array",
          description:
            "The list of appeal categories. The allowed appeal categories are: `VERIFY_TAX_ID`, `VERIFY_NON_PROFIT`, `VERIFY_GOVERNMENT`, `LOW_SCORE`",
          items: {
            type: "string"
          }
        },
        evidence: {
          type: "array",
          description: "An array of evidence UUIDs to be associated with the appeal",
          items: {
            type: "string"
          }
        },
        explanation: {
          type: "string",
          description: "The appeal comment or justification"
        },
        evp_id: {
          type: "string",
          description: "EVP ID"
        },
        vetting_id: {
          type: "string",
          description: "The vetting unique identifier"
        }
      },
      required: ["brand_id", "appeal_categories", "evidence"]
    }
  },
  {
    name: "10dlc_brands_vettings_appeals_get",
    description:
      "List external vetting appeals for a 10DLC Brand. Use this method to query a 10DLC Brand’s external vetting appeals, their statuses, and outcomes.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        }
      },
      required: ["brand_id"]
    }
  },
  {
    name: "tcr_usecase_get",
    description:
      "Qualify a 10DLC Brand for a use case. Use this method to qualify a 10DLC Brand for a use case.\n\nIf the Brand is qualified to run a Campaign across one or more MNOs, the API will return a list of MNO-specific attributes (e.g., AT&T message class), restrictions, and pre/post-approval validation requirements. Additionally, the response will provide the monthly fee associated with the use case.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        use_case: {
          type: "string",
          description: "The use case name",
          enum: [
            "AGENTS_FRANCHISES",
            "CARRIER_EXEMPT",
            "CHARITY",
            "EMERGENCY",
            "K12_EDUCATION",
            "LOW_VOLUME",
            "M2M",
            "MIXED",
            "POLITICAL",
            "PROXY",
            "SOCIAL",
            "SOLE_PROPRIETOR",
            "SWEEPSTAKE",
            "TRIAL",
            "UCAAS_HIGH",
            "UCAAS_LOW",
            "2FA",
            "ACCOUNT_NOTIFICATION",
            "CUSTOMER_CARE",
            "DELIVERY_NOTIFICATION",
            "FRAUD_ALERT",
            "HIGHER_EDUCATION",
            "MARKETING",
            "POLLING_VOTING",
            "PUBLIC_SERVICE_ANNOUNCEMENT",
            "SECURITY_ALERT"
          ]
        }
      },
      required: ["brand_id", "use_case"]
    }
  },
  {
    name: "10dlc_brands_campaigns_list",
    description:
      "List all 10DLC Campaigns on your account. Use this method to query all 10DLC Campaigns on your account.\nThe results are paginated with 25 records per page by default.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Filter results by the Campaign name"
        },
        usecase: {
          type: "string",
          description: "Filter results by the use case"
        },
        status: {
          type: "string",
          description: "Filter results by Campaign status"
        },
        mock: {
          type: "boolean",
          description: "Show only mock Campaigns"
        },
        created_before: {
          type: "string",
          description:
            "Filter results by specifying the end date for the Campaign creation date range in the `yyyy-mm-dd` format",
          format: "date"
        },
        created_after: {
          type: "string",
          description:
            "Filter results by specifying the start date for the Campaign creation date range in the `yyyy-mm-dd` format",
          format: "date"
        },
        page: {
          type: "integer",
          description: "The requested page",
          format: "int32"
        },
        per_page: {
          type: "integer",
          description: "The number of records per page",
          format: "int32"
        }
      }
    }
  },
  {
    name: "10dlc_brands_campaigns_get",
    description:
      "List all 10DLC Campaigns associated with a Brand. Use this method to query all 10DLC Campaigns associated with a Brand.\n\nThe results are paginated with 25 records per page by default.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        name: {
          type: "string",
          description: "Filter results by the Campaign name"
        },
        usecase: {
          type: "string",
          description: "Filter results by the use case"
        },
        status: {
          type: "string",
          description: "Filter results by Campaign status"
        },
        mock: {
          type: "boolean",
          description: "Show only mock Campaigns"
        },
        created_before: {
          type: "string",
          description:
            "Filter results by specifying the end date for the Campaign creation date range in the `yyyy-mm-dd` format",
          format: "date"
        },
        created_after: {
          type: "string",
          description:
            "Filter results by specifying the start date for the Campaign creation date range in the `yyyy-mm-dd` format",
          format: "date"
        },
        page: {
          type: "integer",
          description: "The requested page",
          format: "int32"
        },
        per_page: {
          type: "integer",
          description: "The number of records per page",
          format: "int32"
        }
      },
      required: ["brand_id"]
    }
  },
  {
    name: "10dlc_brands_campaigns_create",
    description: "Register a 10DLC Campaign. Use this method to update a 10DLC Campaign.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        affiliate_marketing: {
          type: "boolean",
          description: "Indicates whether the Campaign is used for affiliate marketing"
        },
        age_gated: {
          type: "boolean",
          description: "Indicates whether the Campaign messages contain age-gated content"
        },
        auto_renewal: {
          type: "boolean",
          description: "Indicates whether the Campaign should be automatically renewed"
        },
        direct_lending: {
          type: "boolean",
          description: "Indicates whether the Campaign messages contain direct lending content"
        },
        embedded_links: {
          type: "boolean",
          description: "Indicates whether the Campaign messages contain embedded links"
        },
        embedded_phones: {
          type: "boolean",
          description: "Indicates whether the Campaign messages contain embedded phone numbers"
        },
        embedded_link_sample: {
          type: "string",
          description: "An embedded link sample"
        },
        description: {
          type: "string",
          description: "The Campaign description"
        },
        optin_workflow: {
          type: "string",
          description: "The opt-in workflow - the process through which consumers opt-in to the Campaign"
        },
        help: {
          type: "boolean",
          description:
            "Indicates whether the campaign has a help system (e.g. keyword: HELP, INFO) that subscribers can use or not."
        },
        help_keywords: {
          type: "string",
          description: "A comma-separated list of HELP keywords. The HELP keywords are case-insensitive."
        },
        help_message: {
          type: "string",
          description: "An acknowledgement to be sent when a HELP keyword is received"
        },
        optin: {
          type: "boolean",
          description:
            "Indicates whether the campaign requires a subscriber to opt-in before receiving messages or not."
        },
        optin_keywords: {
          type: "string",
          description: "A comma-separated list of OPT-IN keywords. The OPT-IN keywords are case-insensitive."
        },
        optin_message: {
          type: "string",
          description: "An acknowledgement to be sent when an OPT-IN keyword is received"
        },
        optout: {
          type: "boolean",
          description:
            "Indicates whether the campaign has an opt-out system (e.g. keyword: STOP, QUIT) that subscribers can use or not."
        },
        optout_keywords: {
          type: "string",
          description: "A comma-separated list of OPT-OUT keywords. The OPT-OUT keywords are case-insensitive."
        },
        optout_message: {
          type: "string",
          description: "An acknowledgement to be sent when an OPT-OUT keyword is received"
        },
        name: {
          type: "string",
          description: "A user-defined Campaign name"
        },
        sample1: {
          type: "string",
          description: "Message sample"
        },
        sample2: {
          type: "string",
          description: "Message sample"
        },
        sample3: {
          type: "string",
          description: "Message sample"
        },
        sample4: {
          type: "string",
          description: "Message sample"
        },
        sample5: {
          type: "string",
          description: "Message sample"
        },
        mock: {
          type: "boolean",
          description: "Indicates a mock Campaign. The mock Campaigns cannot be used to send production traffic"
        },
        usecase: {
          type: "string",
          description: "The Campaign use case"
        },
        privacy_policy: {
          type: "string",
          description: "A link to the Campaign privacy policy"
        },
        terms_conditions: {
          type: "string",
          description: "A link to the Campaign terms and conditions"
        }
      },
      required: [
        "brand_id",
        "affiliate_marketing",
        "age_gated",
        "auto_renewal",
        "direct_lending",
        "embedded_links",
        "embedded_phones",
        "embedded_link_sample",
        "description",
        "optin_workflow",
        "help",
        "help_keywords",
        "help_message",
        "optin",
        "optin_keywords",
        "optin_message",
        "optout",
        "optout_keywords",
        "optout_message",
        "name",
        "sample1",
        "sample2",
        "sample3",
        "sample4",
        "sample5",
        "mock",
        "usecase",
        "terms_conditions"
      ]
    }
  },
  {
    name: "10dlc_brands_campaigns_get_get",
    description: "Query a specific 10DLC Campaign. Use this method to query a specific 10DLC Campaign details.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        campaign_id: {
          type: "string",
          description: "Unique identifier of a Campaign"
        }
      },
      required: ["brand_id", "campaign_id"]
    }
  },
  {
    name: "10dlc_brands_campaigns_update",
    description: "Update a 10DLC Campaign. Use this method to update a 10DLC Campaign.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        campaign_id: {
          type: "string",
          description: "Unique identifier of a Campaign"
        },
        name: {
          type: "string",
          description: "A user-defined Campaign name"
        },
        usecase: {
          type: "string",
          description: "Campaign use case",
          enum: [
            "CUSTOMER_CARE",
            "MARKETING",
            "ACCOUNT_NOTIFICATION",
            "FRAUD_ALERT",
            "PUBLIC_SERVICE_ANNOUNCEMENT",
            "SECURITY_ALERT"
          ]
        },
        description: {
          type: "string",
          description: "The Campaign description"
        },
        embedded_links: {
          type: "boolean",
          description: "Indicates whether the Campaign messages contain embedded links"
        },
        embedded_phones: {
          type: "boolean",
          description: "Indicates whether the Campaign messages contain embedded phone numbers"
        },
        age_gated: {
          type: "boolean",
          description: "Indicates whether the Campaign messages contain age-gated content"
        },
        direct_lending: {
          type: "boolean",
          description: "Indicates whether the Campaign messages contain direct lending content"
        },
        optin: {
          type: "boolean",
          description: "Indicates whether the Campaign supports opt-in functionality"
        },
        optout: {
          type: "boolean",
          description: "Indicates whether the Campaign supports opt-out functionality"
        },
        help: {
          type: "boolean",
          description: "Indicates whether the Campaign provides HELP responses"
        },
        sample1: {
          type: "string",
          description: "Message sample"
        },
        sample2: {
          type: "string",
          description: "Message sample"
        },
        sample3: {
          type: "string",
          description: "Message sample"
        },
        sample4: {
          type: "string",
          description: "Message sample"
        },
        sample5: {
          type: "string",
          description: "Message sample"
        },
        optin_workflow: {
          type: "string",
          description: "The opt-in workflow - the process through which consumers opt-in to the Campaign"
        },
        help_message: {
          type: "string",
          description: "An acknowledgement to be sent when a HELP keyword is received"
        },
        optin_message: {
          type: "string",
          description: "An acknowledgement to be sent when an OPT-IN keyword is received"
        },
        optout_message: {
          type: "string",
          description: "An acknowledgement to be sent when an OPT-OUT keyword is received"
        },
        auto_renewal: {
          type: "boolean",
          description: "Indicates whether the Campaign should be automatically renewed"
        },
        optin_keywords: {
          type: "string",
          description: "A comma-separated list of OPT-IN keywords. The OPT-IN keywords are case-insensitive."
        },
        help_keywords: {
          type: "string",
          description: "A comma-separated list of HELP keywords. The HELP keywords are case-insensitive."
        },
        optout_keywords: {
          type: "string",
          description: "A comma-separated list of OPT-OUT keywords. The OPT-OUT keywords are case-insensitive."
        },
        terms_conditions: {
          type: "string",
          description: "A link to the Campaign terms and conditions"
        },
        privacy_policy: {
          type: "string",
          description: "A link to the Campaign privacy policy"
        },
        embedded_link_sample: {
          type: "string",
          description: "An embedded link sample"
        }
      },
      required: ["brand_id", "campaign_id"]
    }
  },
  {
    name: "10dlc_brands_campaigns_delete",
    description:
      "Delete a 10DLC Campaign. Use this method to delete a 10DLC Campaign.\n\n**Note** You will not be able to use any phone number associated with the Campaign as a Sender IDs once it is deleted.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        campaign_id: {
          type: "string",
          description: "Unique identifier of a Campaign"
        }
      },
      required: ["brand_id", "campaign_id"]
    }
  },
  {
    name: "10dlc_subscriptions_create",
    description: "Subscribe to Wavix 10DLC events. Use this method to subscribe to Wavix 10DLC events.",
    inputSchema: {
      type: "object",
      properties: {
        subscription_category: {
          type: "string",
          description: "The Wavix 10DLC event type. Can be one of the following: `brand`, `campaign`, or `number`."
        },
        url: {
          type: "string",
          description: "A webhook URL to send events to"
        }
      },
      required: ["subscription_category", "url"]
    }
  },
  {
    name: "10dlc_subscriptions_list",
    description:
      "List Wavix 10DLC event subscriptions. Use this method to list all 10DLC event subscriptions on your account.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "10dlc_subscriptions_delete",
    description:
      "Delete a Wavix 10DLC event subscription. Use this method to delete a Wavix 10DLC event subscription from your account.",
    inputSchema: {
      type: "object",
      properties: {
        subscription_category: {
          type: "string",
          description: "The Wavix 10DLC event category you want to unsubscribe from"
        }
      },
      required: ["subscription_category"]
    }
  },
  {
    name: "10dlc_brands_campaigns_numbers_create",
    description:
      "Link a number to a 10DLC Campaign. Use this method to link a phone number to a 10DLC Campaign.\n\nWavix will automatically create a Sender ID associated with the number, once it is successfully approved. The Sender ID will be allowed-listed for the U.S.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        campaign_id: {
          type: "string",
          description: "Unique identifier of a Campaign"
        },
        number: {
          type: "string",
          description: "The phone number to associate with the Campaign"
        }
      },
      required: ["brand_id", "campaign_id", "number"]
    }
  },
  {
    name: "10dlc_brands_campaigns_numbers_delete",
    description:
      "Delete a number from a 10DLC Campaign. Use this method to remove a number from a Campaign.\n\nAfter the phone number is deleted from the Campaign,\n the Sender ID associated with the number will also be automatically deleted.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        campaign_id: {
          type: "string",
          description: "Unique identifier of a Campaign"
        },
        number: {
          type: "string",
          description: "A phone number to be deleted from the Campaign"
        }
      },
      required: ["brand_id", "campaign_id", "number"]
    }
  },
  {
    name: "10dlc_brands_campaigns_numbers_get",
    description:
      "List numbers associated with a 10DLC Campaign. Use this method to query a list of phone numbers associated with a 10DLC Campaign.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        campaign_id: {
          type: "string",
          description: "Unique identifier of a Campaign"
        }
      },
      required: ["brand_id", "campaign_id"]
    }
  },
  {
    name: "10dlc_brands_campaigns_nudge_create",
    description:
      "Nudge a carrier to review the campaign. Use this method to prompt the intended party to take action on a campaign. You can nudge for review if the approval process is delayed or appeal if the campaign has been rejected.\nSet the ***nudge_intent*** parameter to ```REVIEW``` to request action on a pending approval, or to ```APPEAL_REJECTION``` to submit an appeal for a rejected campaign.\n\nNote:\n\n- You can only request action on campaigns that are at least 72 hours old.\n- Only one nudge request per campaign is allowed within a 24-hour period.",
    inputSchema: {
      type: "object",
      properties: {
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
        },
        campaign_id: {
          type: "string",
          description: "Unique identifier of a Campaign"
        },
        nudge_intent: {
          type: "string",
          description:
            "The nudge intent. Use ```REVIEW``` to request action on a pending approval, or to ```APPEAL_REJECTION``` to submit an appeal for a rejected campaign."
        },
        description: {
          type: "string",
          description: "The description of the nudge request"
        }
      },
      required: ["brand_id", "campaign_id", "nudge_intent", "description"]
    }
  },
  {
    name: "validation_list",
    description:
      "Validate a single phone number. Use this method to get extended information about a single phone number. The information returned varies based on the `type` parameter.",
    inputSchema: {
      type: "object",
      properties: {
        phone_number: {
          type: "string",
          description: "Phone number to validate. May be formatted with or without the “+” leading sign."
        },
        type: {
          type: "object",
          description: "Validation type"
        }
      },
      required: ["phone_number", "type"]
    }
  },
  {
    name: "validation_create",
    description:
      'Validate multiple phone numbers. Use this method to get detailed information about several phone numbers with a single request. Under most circumstances, it takes about 30 seconds to validate a batch of 1,000 phone numbers. We recommend using `async:true` if you plan to validate more than 1,000 numbers.\n\nA maximum of 100,000 phone numbers per request is allowed.\n\nWhen you execute the request asynchronously, Wavix immediately starts to validate the phone numbers and returns a token that needs to be used to poll the results.\n\n```\n{\n  "request_uuid": "12542c5c-1a17-4d12-a163-5b68543e75f6"\n}\n```',
    inputSchema: {
      type: "object",
      properties: {
        phone_numbers: {
          type: "array",
          description: "An array of phone numbers to get detailed information about",
          items: {
            type: "string"
          }
        },
        type: {
          type: "string",
          description: "Phone number validation type",
          enum: ["format", "analysis", "validation"]
        },
        async: {
          type: "boolean",
          description: "Indicates whether the request should be executed asynchronously. The default value is false."
        },
        force: {
          type: "boolean",
          description: "Force"
        }
      },
      required: ["phone_numbers", "type", "async", "force"]
    }
  },
  {
    name: "validation_get",
    description: "Get asynchronous validation results. Use this method to poll asynchronous validation results.",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Unique validation token"
        }
      },
      required: ["uuid"]
    }
  },
  {
    name: "voice_campaigns_create",
    description:
      "Trigger a scenario. The Wavix's Visual Campaign builder allows you to create custom scenarios for outbound calls using an intuitive, drag-and-drop user interface.\n\nUse this method to trigger automatic calls that are programmed to follow your specific scenario.",
    inputSchema: {
      type: "object",
      properties: {
        voice_campaign: {
          type: "object"
        }
      },
      required: ["voice_campaign"]
    }
  },
  {
    name: "voice_campaign_get",
    description: "Get a specific voice campaign. Use this method to get details of a specific voice campaign.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "Voice campaign ID",
          format: "int32"
        }
      },
      required: ["id"]
    }
  },
  {
    name: "short_links_create",
    description:
      "Create a short link. By utilizing the Wavix Short Links API, you have the capability to transform lengthy URLs into concise and user-friendly links, resulting in reduced character usage and enhanced user experience. The generated short URLs not only serve as a more compact representation but also provide valuable insights into user engagement. Additionally, the API allows you to set an expiration time for the short link and specify the redirection URL.\n\n\nUse this method to generate a shortened link from a lengthy URL. It offers the flexibility to customize various parameters such as the expiration time, fallback URL, and UTM parameter containing the campaign name.",
    inputSchema: {
      type: "object",
      properties: {
        link: {
          type: "string",
          description: "The long URL to be shortened"
        },
        expiration_time: {
          type: "string",
          description: "The expiration time of the short link",
          format: "date-time"
        },
        fallback_url: {
          type: "string",
          description: "The URL to redirect to if the short link is expired or invalid"
        },
        phone: {
          type: "string",
          description: "The phone number associated with the short link"
        },
        utm_campaign: {
          type: "string",
          description:
            "The UTM campaign parameter; you can use this parameter to group the tracking insight by campaign"
        }
      },
      required: ["link"]
    }
  },
  {
    name: "short_links_metrics_list",
    description:
      "Get metrics for short links. Using this method, you gain the ability to access metrics related to clicked short links. Queries can be made based on parameters such as phone number, campaign name, or date, enabling you to retrieve specific information about the link's performance.",
    inputSchema: {
      type: "object",
      properties: {
        from: {
          type: "string",
          description: "Start date of your search time range, in `yyyy-mm-dd` format."
        },
        to: {
          type: "string",
          description: "End date of your search time range, in `yyyy-mm-dd` format."
        },
        phone: {
          type: "string",
          description: "Filter results by the phone number associated with the short links."
        },
        utm_campaign: {
          type: "string",
          description:
            "Filter results by the UTM campaign parameter. You can use this parameter to group the tracking insights by campaign."
        },
        page: {
          type: "integer",
          description: "The page number",
          format: "int32"
        },
        per_page: {
          type: "integer",
          description: "The number of records per page",
          format: "int32"
        }
      },
      required: ["from", "to"]
    }
  },
  {
    name: "two_fa_verification_create",
    description:
      "Create a new 2FA Verification. Before sending and validating a one-time password (OTP), you must create a 2FA Service using the Wavix portal. The service must be created only once, you can use it to generate and validate as many OTPs as needed.\n\nIn order to send and verify an OTP, you must:\n1. Create a new 2FA Verification using this API. The Wavix platform will automatically generate a random code and send it to the phone number specified in the request.\n2. In cases when an end user requests a new OTP, you can reuse the same 2FA Verification to resend the code.\n3. Validate the OTP using the Wavix 2FA API.\n\nUse this method to create a new Wavix 2FA Verification. Once the Verification is created, Wavix will automatically generate a new random verification code and send it to the end user's phone number via the communication channel specified in the request.",
    inputSchema: {
      type: "object",
      properties: {
        service_id: {
          type: "string",
          description: "Unique Wavix 2FA Service ID. Find your 2FA Service ID on the Wavix portal."
        },
        to: {
          type: "string",
          description:
            "End user's phone number to which the verification code will be sent. The phone number must be in E.164 format."
        },
        channel: {
          type: "string",
          description: "The communication channel you want to use. Can be either `sms` or `voice`."
        }
      },
      required: ["service_id", "to", "channel"]
    }
  },
  {
    name: "two_fa_service_sessions_get",
    description:
      "List Wavix 2FA Verifications. Use this method to retrieve active Wavix 2FA Verifications on your account. The list can be filtered by the unique identifier of the Wavix 2FA Service and the date.",
    inputSchema: {
      type: "object",
      properties: {
        service_uuid: {
          type: "string",
          description: "Wavix 2FA Service ID"
        },
        from: {
          type: "string",
          description: "Start date of your search time range, in `yyyy-mm-dd` format",
          format: "date"
        },
        to: {
          type: "string",
          description: "End date of your search time range, in `yyyy-mm-dd` format",
          format: "date"
        }
      },
      required: ["service_uuid", "from", "to"]
    }
  },
  {
    name: "two_fa_verification_create_create",
    description:
      "Resend a verification code. Use this method to resend a verification code using the same or a different communication channel. Each time you use this method, the Wavix platform generates a new random verification code and sends it using the communication channel specified in the request. Any codes sent previously will be automatically invalidated. Validation of such codes will be unsuccessful.",
    inputSchema: {
      type: "object",
      properties: {
        session_uuid: {
          type: "string",
          description: "Wavix 2FA Verification ID"
        },
        channel: {
          type: "string",
          description: "The communication channel you want to use. Can be either `sms` or `voice`.",
          enum: ["sms", "voice"]
        }
      },
      required: ["session_uuid", "channel"]
    }
  },
  {
    name: "two_fa_verification_check_create",
    description:
      "Validate a code. To validate an OTP, an end user must enter the received code into your service or application and submit it for validation.\n\nOnce the code is submitted, use this method to check whether the code is valid. Pass the entered code and the 2FA Verification ID to verify whether the entered code matches the latest one sent to the end user's phone number within the specified 2FA Verification.",
    inputSchema: {
      type: "object",
      properties: {
        session_uuid: {
          type: "string",
          description: "Wavix 2FA Verification ID"
        },
        code: {
          type: "string",
          description: "The code entered by an end user"
        }
      },
      required: ["session_uuid", "code"]
    }
  },
  {
    name: "two_fa_verification_cancel_patch",
    description:
      "Cancel a 2FA Verification. Use this method to explicitly cancel a 2FA Verification. Once the verification is canceled, no further codes will be sent and you won't be able to validate any codes sent previously. You'll need to create a new Verification to send a new code.",
    inputSchema: {
      type: "object",
      properties: {
        session_uuid: {
          type: "string",
          description: "Wavix 2FA Verification ID"
        }
      },
      required: ["session_uuid"]
    }
  },
  {
    name: "two_fa_session_events_get",
    description:
      "List Wavix 2FA Verification events. Use this method to retrieve a list of events associated with a 2FA Verification. The resulting list provides detailed information about each event within the Verification, including associated costs.",
    inputSchema: {
      type: "object",
      properties: {
        session_uuid: {
          type: "string",
          description: "Wavix 2FA Verification ID"
        }
      },
      required: ["session_uuid"]
    }
  },
  {
    name: "billing_transactions_list",
    description:
      "Get transactions on the account. Use this method to retrieve a list of financial transactions on your account. By default, results are limited to 25 records per page. You can filter the results by date range, transaction type, and comment text.",
    inputSchema: {
      type: "object",
      properties: {
        from_date: {
          type: "string",
          description: "Start date of the search time range, in `yyyy-mm-dd` format."
        },
        to_date: {
          type: "string",
          description: "End date of the search time range, in `yyyy-mm-dd` format."
        },
        type: {
          type: "object"
        },
        details_contains: {
          type: "string",
          description: "Transaction comment"
        },
        payments: {
          type: "boolean",
          description: "Retrieve a list of account top-ups only"
        },
        page: {
          type: "integer",
          description: "Requested page",
          format: "int32"
        },
        per_page: {
          type: "integer",
          description: "Number of records per page",
          format: "int32"
        }
      },
      required: ["from_date", "to_date"]
    }
  },
  {
    name: "billing_invoices_list",
    description:
      "Get statements on the account. Use this method to retrieve a list of all financial statements on your account. The results are paginated with 25 records per page by default.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "integer",
          description: "Requested page",
          format: "int32"
        },
        per_page: {
          type: "integer",
          description: "Number of records per page",
          format: "int32"
        }
      }
    }
  },
  {
    name: "billing_invoices_get",
    description:
      "Download a statement. Use this method to download a system-generated financial statement as a PDF file.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "Unique identifier of the statement",
          format: "int32"
        }
      },
      required: ["id"]
    }
  },
  {
    name: "profile_update",
    description:
      "Update customer info. Use this method to update personal and billing information in your account. You can also use this method to change the webhook address for forwarding inbound SMS and MMS messages sent to SMS-enabled phone numbers in your account.",
    inputSchema: {
      type: "object",
      properties: {
        additional_info: {
          type: "string",
          description: "Account additional info specified by the account owner"
        },
        contacts: {
          type: "string",
          description: "User's contact email"
        },
        default_short_link_endpoint: {
          type: "string",
          description: "Default short link endpoint"
        },
        first_name: {
          type: "string",
          description: "Account owner's first name"
        },
        last_name: {
          type: "string",
          description: "Account owner's last name"
        },
        phone: {
          type: "string",
          description: "Account owner's phone number"
        },
        sms_relay_url: {
          type: "string",
          description: "SMS relay URL"
        },
        dlr_relay_url: {
          type: "string",
          description: "DLR relay URL"
        },
        time_zone: {
          type: "string",
          description: "User's timezone"
        },
        job_title: {
          type: "string",
          description: "User's job title"
        },
        company_info: {
          type: "object"
        }
      }
    }
  },
  {
    name: "profile_get",
    description:
      "Get customer info. Use this method to return the personal and billing information for your account. The response also includes the webhook address used to forward inbound SMS and MMS messages sent to SMS-enabled phone numbers in the account.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "profile_config_list",
    description:
      "Get account settings. Use this method to retrieve account balance and configuration details. The response includes available funds and account limits, such as maximum call length, maximum call price, and the number of concurrent calls allowed.",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  {
    name: "sub_organizations_list",
    description: "Get sub-accounts. Use this method to retrieve a list of your sub-accounts.",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description: "Filter by account status",
          enum: ["enabled", "disabled"]
        }
      }
    }
  },
  {
    name: "sub_organizations_create",
    description:
      "Create a new sub-account. Use this method to create a new sub-account. You can specify the sub-account's name and default  webhook URLs for inbound messages and delivery reports.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Company name"
        },
        default_destinations: {
          type: "object",
          description: "Default webhook URLs for inbound messages and delivery reports"
        }
      },
      required: ["name"]
    }
  },
  {
    name: "sub_organizations_get",
    description: "Get a specific sub-account. Use this method to retrieve a specific sub-account details.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "Sub-account ID",
          format: "int32"
        }
      },
      required: ["id"]
    }
  },
  {
    name: "sub_organizations_update",
    description:
      "Update a sub-account. Use this method to updates sub-account details. You can change the sub-account's name, status, and default inbound messages and DLR webhook URLs.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "Sub-account ID",
          format: "int32"
        },
        name: {
          type: "string",
          description: "Company name"
        },
        status: {
          type: "string",
          description: "User status",
          enum: ["enabled", "disabled"]
        },
        default_destinations: {
          type: "object",
          description: "Default webhook URLs for inbound messages and delivery reports"
        }
      },
      required: ["id", "name"]
    }
  },
  {
    name: "sub_organizations_billing_transactions_get",
    description:
      "List transactions for a sub-account. Use this method to list transactions for a specific sub-account. By default, results are limited to 25 records per page. You can filter the transactions by date range and type.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "Sub-account ID",
          format: "int32"
        },
        from_date: {
          type: "string",
          description: "Start date of your search time range, in `yyyy-mm-dd` format",
          format: "date"
        },
        to_date: {
          type: "string",
          description: "End date of your search time range, in `yyyy-mm-dd` format",
          format: "date"
        },
        type: {
          type: "string",
          description: "Transaction type(s)"
        }
      },
      required: ["id", "from_date", "to_date"]
    }
  }
]

/**
 * Metadata mapping tool names to API endpoints
 */
export const toolMeta = new Map<string, ToolMetaInfo>([
  [
    "sip_trunks_list",
    {
      path: "/trunks",
      method: "GET",
      operationId: "ListSIPtrunksontheaccount"
    }
  ],
  [
    "sip_trunk_create",
    {
      path: "/trunks",
      method: "POST",
      operationId: "CreateanewSIPtrunk"
    }
  ],
  [
    "sip_trunk_get",
    {
      path: "/trunks/{id}",
      method: "GET",
      operationId: "GetSIPtrunkconfiguration"
    }
  ],
  [
    "sip_trunk_update",
    {
      path: "/trunks/{id}",
      method: "PUT",
      operationId: "UpdateaSIPtrunk"
    }
  ],
  [
    "sip_trunk_delete",
    {
      path: "/trunks/{id}",
      method: "DELETE",
      operationId: "DeleteaSIPtrunk"
    }
  ],
  [
    "buy_countries_list",
    {
      path: "/buy/countries",
      method: "GET",
      operationId: "Getalistofcountries"
    }
  ],
  [
    "buy_regions_list",
    {
      path: "/buy/countries/{country}/regions",
      method: "GET",
      operationId: "Getalistofregions"
    }
  ],
  [
    "buy_cities_list",
    {
      path: "/buy/countries/{country}/cities",
      method: "GET",
      operationId: "Getalistofcitiesinacountry"
    }
  ],
  [
    "buy_region_cities_list",
    {
      path: "/buy/countries/{country}/regions/{region}/cities",
      method: "GET",
      operationId: "Getalistofcitiesinaregion"
    }
  ],
  [
    "buy_numbers_available",
    {
      path: "/buy/countries/{country}/cities/{city}/dids",
      method: "GET",
      operationId: "Getnumbersavailableforpurchase"
    }
  ],
  [
    "buy_cart_update",
    {
      path: "/buy/cart",
      method: "PUT",
      operationId: "AddDIDnumberstothecart"
    }
  ],
  [
    "cart_get",
    {
      path: "/buy/cart",
      method: "GET",
      operationId: "Getcartcontent"
    }
  ],
  [
    "cart_clear",
    {
      path: "/buy/cart",
      method: "DELETE",
      operationId: "Removenumbersfromthecart"
    }
  ],
  [
    "cart_checkout",
    {
      path: "/buy/cart/checkout",
      method: "POST",
      operationId: "CheckoutDIDnumbers"
    }
  ],
  [
    "numbers_list",
    {
      path: "/mydids",
      method: "GET",
      operationId: "GetDIDsontheaccount"
    }
  ],
  [
    "numbers_bulk_delete",
    {
      path: "/mydids",
      method: "DELETE",
      operationId: "ReturnDIDstostock"
    }
  ],
  [
    "number_get",
    {
      path: "/mydids/{id}",
      method: "GET",
      operationId: "GetaspecificDID"
    }
  ],
  [
    "mydids_update",
    {
      path: "/mydids/{id}",
      method: "PUT",
      operationId: "UpdateaspecificDID"
    }
  ],
  [
    "numbers_sms_update",
    {
      path: "/mydids/update-sms-enabled",
      method: "PUT",
      operationId: "UpdateSMSenabledstatusforaDID"
    }
  ],
  [
    "mydids_update_destinations_create",
    {
      path: "/mydids/update-destinations",
      method: "POST",
      operationId: "UpdateDIDdestinations"
    }
  ],
  [
    "numbers_papers_upload",
    {
      path: "/mydids/papers",
      method: "POST",
      operationId: "UploadadocumentfortheDID"
    }
  ],
  [
    "cdr_list",
    {
      path: "/cdr",
      method: "GET",
      operationId: "GetCDRsontheaccount"
    }
  ],
  [
    "cdr_export",
    {
      path: "/cdr",
      method: "POST",
      operationId: "Searchforcallscontainingspecifickeywordsorphrases"
    }
  ],
  [
    "cdr_retranscribe_update",
    {
      path: "/cdr/{cdr_uuid}/retranscribe",
      method: "PUT",
      operationId: "Transcribeasinglecall"
    }
  ],
  [
    "cdr_transcription_get",
    {
      path: "/cdr/{cdr_uuid}/transcription",
      method: "GET",
      operationId: "Requesttranscriptionforaspecificcall"
    }
  ],
  [
    "cdr_get",
    {
      path: "/cdr/{uuid}",
      method: "GET",
      operationId: "Getcalldetailsofaspecificcall"
    }
  ],
  [
    "cdr_list_all",
    {
      path: "/cdr/all",
      method: "GET",
      operationId: "GetallCDRrecordsasNDJSONstream"
    }
  ],
  [
    "recordings_list",
    {
      path: "/recordings",
      method: "GET",
      operationId: "Getcallrecordings"
    }
  ],
  [
    "recording_get_by_cdr",
    {
      path: "/recordings/{cdr_uuid}",
      method: "GET",
      operationId: "Getcallrecordingbycdruuid"
    }
  ],
  [
    "recordings_delete",
    {
      path: "/recordings/{id}",
      method: "DELETE",
      operationId: "Deletecallrecording"
    }
  ],
  [
    "speech_analytics_create",
    {
      path: "/speech-analytics",
      method: "POST",
      operationId: "Submitafilefortranscription"
    }
  ],
  [
    "speech_analytics_get",
    {
      path: "/speech-analytics/{uuid}",
      method: "GET",
      operationId: "Queryaspecifictranscription"
    }
  ],
  [
    "speech_analytics_update",
    {
      path: "/speech-analytics/{uuid}",
      method: "PUT",
      operationId: "Retranscribeaudiofile"
    }
  ],
  [
    "speech_analytics_file_download",
    {
      path: "/speech-analytics/{uuid}/file",
      method: "GET",
      operationId: "Gettranscriptionfile"
    }
  ],
  [
    "call_webhooks_get",
    {
      path: "/call/webhooks",
      method: "GET",
      operationId: "Getcallwebhooks"
    }
  ],
  [
    "call_webhooks_create",
    {
      path: "/call/webhooks",
      method: "POST",
      operationId: "Createcallwebhook"
    }
  ],
  [
    "call_webhooks_delete",
    {
      path: "/call/webhooks",
      method: "DELETE",
      operationId: "Deletecallwebhook"
    }
  ],
  [
    "call_create",
    {
      path: "/call",
      method: "POST",
      operationId: "StartCall"
    }
  ],
  [
    "calls_list",
    {
      path: "/call",
      method: "GET",
      operationId: "GetUserCalls"
    }
  ],
  [
    "call_get",
    {
      path: "/call/{uuid}",
      method: "GET",
      operationId: "GetUserCall"
    }
  ],
  [
    "call_hangup",
    {
      path: "/call/{uuid}",
      method: "DELETE",
      operationId: "TerminateCall"
    }
  ],
  [
    "call_answer",
    {
      path: "/call/{uuid}/answer",
      method: "POST",
      operationId: "AnswerCall"
    }
  ],
  [
    "call_stream_start",
    {
      path: "/call/{uuid}/streams",
      method: "POST",
      operationId: "StartCallStreaming"
    }
  ],
  [
    "call_stream_stop",
    {
      path: "/call/{uuid}/streams/{stream_uuid}",
      method: "DELETE",
      operationId: "DeleteCallStream"
    }
  ],
  [
    "call_play",
    {
      path: "/call/{uuid}/play",
      method: "POST",
      operationId: "PlayAudio"
    }
  ],
  [
    "call_audio_delete",
    {
      path: "/call/{uuid}/audio",
      method: "DELETE",
      operationId: "StopAudio"
    }
  ],
  [
    "call_dtmf_collect",
    {
      path: "/call/{uuid}/collect",
      method: "POST",
      operationId: "CollectDtmf"
    }
  ],
  [
    "webrtc_token_create",
    {
      path: "/webrtc/tokens",
      method: "POST",
      operationId: "GenerateWidgetToken"
    }
  ],
  [
    "webrtc_tokens_list",
    {
      path: "/webrtc/tokens",
      method: "GET",
      operationId: "GetActiveWidgetTokens"
    }
  ],
  [
    "webrtc_token_get",
    {
      path: "/webrtc/tokens/{uuid}",
      method: "GET",
      operationId: "GetWidgetTokenInfo"
    }
  ],
  [
    "webrtc_token_update",
    {
      path: "/webrtc/tokens/{uuid}",
      method: "PUT",
      operationId: "ManageWidgetTokenPayload"
    }
  ],
  [
    "webrtc_token_delete",
    {
      path: "/webrtc/tokens/{uuid}",
      method: "DELETE",
      operationId: "DeleteWidgetToken"
    }
  ],
  [
    "sms_sender_ids_list",
    {
      path: "/messages/sender_ids",
      method: "GET",
      operationId: "ListSenderIDsontheaccount"
    }
  ],
  [
    "sms_sender_id_create",
    {
      path: "/messages/sender_ids",
      method: "POST",
      operationId: "ProvisionanewSenderID"
    }
  ],
  [
    "sms_sender_id_get",
    {
      path: "/messages/sender_ids/{id}",
      method: "GET",
      operationId: "GetSenderIDById"
    }
  ],
  [
    "sms_sender_id_delete",
    {
      path: "/messages/sender_ids/{id}",
      method: "DELETE",
      operationId: "DeleteaSenderID"
    }
  ],
  [
    "sms_opt_out_add",
    {
      path: "/messages/opt_outs",
      method: "POST",
      operationId: "Opt-outaphonenumberofSMSmessages"
    }
  ],
  [
    "sms_send",
    {
      path: "/messages",
      method: "POST",
      operationId: "SendSMSorMMSmessage"
    }
  ],
  [
    "sms_list",
    {
      path: "/messages",
      method: "GET",
      operationId: "Getmessagesonyouraccount"
    }
  ],
  [
    "sms_get",
    {
      path: "/messages/{id}",
      method: "GET",
      operationId: "Getaspecificmessage"
    }
  ],
  [
    "sms_list_all",
    {
      path: "/messages/all",
      method: "GET",
      operationId: "Getallmessages"
    }
  ],
  [
    "tcr_brands_list",
    {
      path: "/10dlc/brands",
      method: "GET",
      operationId: "List10DLCBrandsonyouraccount"
    }
  ],
  [
    "tcr_brand_create",
    {
      path: "/10dlc/brands",
      method: "POST",
      operationId: "Registera10DLCBrand"
    }
  ],
  [
    "tcr_brand_get",
    {
      path: "/10dlc/brands/{brand_id}",
      method: "GET",
      operationId: "Queryaspecific10DLCBrandonyouraccount"
    }
  ],
  [
    "tcr_brand_update",
    {
      path: "/10dlc/brands/{brand_id}",
      method: "PUT",
      operationId: "Updatea10DLCBrand"
    }
  ],
  [
    "tcr_brand_delete",
    {
      path: "/10dlc/brands/{brand_id}",
      method: "DELETE",
      operationId: "Deletea10DLCBrand"
    }
  ],
  [
    "tcr_brand_appeal_create",
    {
      path: "/10dlc/brands/{brand_id}/appeals",
      method: "POST",
      operationId: "Appeala10DLCBrandIdentityverification"
    }
  ],
  [
    "tcr_brand_appeals_list",
    {
      path: "/10dlc/brands/{brand_id}/appeals",
      method: "GET",
      operationId: "Lista10DLCBrandIdentityverificationappeals"
    }
  ],
  [
    "tcr_evidence_upload",
    {
      path: "/10dlc/brands/{brand_id}/evidence",
      method: "POST",
      operationId: "Uploada10DLCBrandevidence"
    }
  ],
  [
    "tcr_evidence_list",
    {
      path: "/10dlc/brands/{brand_id}/evidence",
      method: "GET",
      operationId: "Lista10DLCBrandappealevidence"
    }
  ],
  [
    "tcr_evidence_get",
    {
      path: "/10dlc/brands/{brand_id}/evidence/{uuid}",
      method: "GET",
      operationId: "Downloadaspecific10DLCBrandappealevidence"
    }
  ],
  [
    "tcr_evidence_delete",
    {
      path: "/10dlc/brands/{brand_id}/evidence/{uuid}",
      method: "DELETE",
      operationId: "Deletea10DLCBrandappealevidence"
    }
  ],
  [
    "tcr_vetting_create",
    {
      path: "/10dlc/brands/{brand_id}/vettings",
      method: "POST",
      operationId: "Requestexternalvettingfora10DLCBrand"
    }
  ],
  [
    "10dlc_brands_vettings_update",
    {
      path: "/10dlc/brands/{brand_id}/vettings",
      method: "PUT",
      operationId: "Importanexternalvettingfora10DLCBrand"
    }
  ],
  [
    "tcr_vettings_list",
    {
      path: "/10dlc/brands/{brand_id}/vettings",
      method: "GET",
      operationId: "List10DLCBrandexternalvettings"
    }
  ],
  [
    "tcr_vetting_appeal_create",
    {
      path: "/10dlc/brands/{brand_id}/vettings/appeals",
      method: "POST",
      operationId: "Appealanexternalvettingfora10DLCBrand"
    }
  ],
  [
    "10dlc_brands_vettings_appeals_get",
    {
      path: "/10dlc/brands/{brand_id}/vettings/appeals",
      method: "GET",
      operationId: "Listexternalvettingappealsfora10DLCBrand"
    }
  ],
  [
    "tcr_usecase_get",
    {
      path: "/10dlc/brands/{brand_id}/usecases/{use_case}",
      method: "GET",
      operationId: "Qualifya10DLCBrandforausecase"
    }
  ],
  [
    "10dlc_brands_campaigns_list",
    {
      path: "/10dlc/brands/campaigns",
      method: "GET",
      operationId: "Listall10DLCCampaignsonyouraccount"
    }
  ],
  [
    "10dlc_brands_campaigns_get",
    {
      path: "/10dlc/brands/{brand_id}/campaigns",
      method: "GET",
      operationId: "Listall10DLCCampaignsassociatedwithaBrand"
    }
  ],
  [
    "10dlc_brands_campaigns_create",
    {
      path: "/10dlc/brands/{brand_id}/campaigns",
      method: "POST",
      operationId: "Registera10DLCCampaign"
    }
  ],
  [
    "10dlc_brands_campaigns_get_get",
    {
      path: "/10dlc/brands/{brand_id}/campaigns/{campaign_id}",
      method: "GET",
      operationId: "Queryaspecific10DLCCampaign"
    }
  ],
  [
    "10dlc_brands_campaigns_update",
    {
      path: "/10dlc/brands/{brand_id}/campaigns/{campaign_id}",
      method: "PUT",
      operationId: "Updatea10DLCCampaign"
    }
  ],
  [
    "10dlc_brands_campaigns_delete",
    {
      path: "/10dlc/brands/{brand_id}/campaigns/{campaign_id}",
      method: "DELETE",
      operationId: "Deletea10DLCCampaign"
    }
  ],
  [
    "10dlc_subscriptions_create",
    {
      path: "/10dlc/subscriptions",
      method: "POST",
      operationId: "SubscribetoWavix10DLCevents"
    }
  ],
  [
    "10dlc_subscriptions_list",
    {
      path: "/10dlc/subscriptions",
      method: "GET",
      operationId: "ListWavix10DLCeventsubscriptions"
    }
  ],
  [
    "10dlc_subscriptions_delete",
    {
      path: "/10dlc/subscriptions",
      method: "DELETE",
      operationId: "DeleteaWavix10DLCeventsubscription"
    }
  ],
  [
    "10dlc_brands_campaigns_numbers_create",
    {
      path: "/10dlc/brands/{brand_id}/campaigns/{campaign_id}/numbers/{number}",
      method: "POST",
      operationId: "Linkanumbertoa10DLCCampaign"
    }
  ],
  [
    "10dlc_brands_campaigns_numbers_delete",
    {
      path: "/10dlc/brands/{brand_id}/campaigns/{campaign_id}/numbers/{number}",
      method: "DELETE",
      operationId: "Deleteanumberfroma10DLCCampaign"
    }
  ],
  [
    "10dlc_brands_campaigns_numbers_get",
    {
      path: "/10dlc/brands/{brand_id}/campaigns/{campaign_id}/numbers",
      method: "GET",
      operationId: "Listnumbersassociatedwitha10DLCCampaign"
    }
  ],
  [
    "10dlc_brands_campaigns_nudge_create",
    {
      path: "/10dlc/brands/{brand_id}/campaigns/{campaign_id}/nudge",
      method: "POST",
      operationId: "Nudgeacarriertoreviewthecampaign"
    }
  ],
  [
    "validation_list",
    {
      path: "/validation",
      method: "GET",
      operationId: "Validateasinglephonenumber"
    }
  ],
  [
    "validation_create",
    {
      path: "/validation",
      method: "POST",
      operationId: "Validatemultiplephonenumbers"
    }
  ],
  [
    "validation_get",
    {
      path: "/validation/{uuid}",
      method: "GET",
      operationId: "Getasynchronousvalidationresults"
    }
  ],
  [
    "voice_campaigns_create",
    {
      path: "/voice-campaigns",
      method: "POST",
      operationId: "Triggerascenario"
    }
  ],
  [
    "voice_campaign_get",
    {
      path: "/voice-campaigns/{id}",
      method: "GET",
      operationId: "Getaspecificvoicecampaign"
    }
  ],
  [
    "short_links_create",
    {
      path: "/short-links",
      method: "POST",
      operationId: "Createashortlink"
    }
  ],
  [
    "short_links_metrics_list",
    {
      path: "/short-links/metrics",
      method: "GET",
      operationId: "Getmetricsforshortlinks"
    }
  ],
  [
    "two_fa_verification_create",
    {
      path: "/two-fa/verification",
      method: "POST",
      operationId: "Createanew2FAVerification"
    }
  ],
  [
    "two_fa_service_sessions_get",
    {
      path: "/two-fa/service/{service_uuid}/sessions",
      method: "GET",
      operationId: "ListWavix2FAVerifications"
    }
  ],
  [
    "two_fa_verification_create_create",
    {
      path: "/two-fa/verification/{session_uuid}",
      method: "POST",
      operationId: "Resendaverificationcode"
    }
  ],
  [
    "two_fa_verification_check_create",
    {
      path: "/two-fa/verification/{session_uuid}/check",
      method: "POST",
      operationId: "Validateacode"
    }
  ],
  [
    "two_fa_verification_cancel_patch",
    {
      path: "/two-fa/verification/{session_uuid}/cancel",
      method: "PATCH",
      operationId: "Cancela2FAVerification"
    }
  ],
  [
    "two_fa_session_events_get",
    {
      path: "/two-fa/session/{session_uuid}/events",
      method: "GET",
      operationId: "ListWavix2FAVerificationevents"
    }
  ],
  [
    "billing_transactions_list",
    {
      path: "/billing/transactions",
      method: "GET",
      operationId: "Gettransactionsontheaccount"
    }
  ],
  [
    "billing_invoices_list",
    {
      path: "/billing/invoices",
      method: "GET",
      operationId: "Getinvoicesontheaccount"
    }
  ],
  [
    "billing_invoices_get",
    {
      path: "/billing/invoices/{id}",
      method: "GET",
      operationId: "Downloadaninvoice"
    }
  ],
  [
    "profile_update",
    {
      path: "/profile",
      method: "PUT",
      operationId: "Updatecustomerinfo"
    }
  ],
  [
    "profile_get",
    {
      path: "/profile",
      method: "GET",
      operationId: "Getcustomerinfo"
    }
  ],
  [
    "profile_config_list",
    {
      path: "/profile/config",
      method: "GET",
      operationId: "Getaccountsettings"
    }
  ],
  [
    "sub_organizations_list",
    {
      path: "/sub-organizations",
      method: "GET",
      operationId: "Getusers"
    }
  ],
  [
    "sub_organizations_create",
    {
      path: "/sub-organizations",
      method: "POST",
      operationId: "Createuser"
    }
  ],
  [
    "sub_organizations_get",
    {
      path: "/sub-organizations/{id}",
      method: "GET",
      operationId: "Getuserbyid"
    }
  ],
  [
    "sub_organizations_update",
    {
      path: "/sub-organizations/{id}",
      method: "PUT",
      operationId: "Updateuser"
    }
  ],
  [
    "sub_organizations_billing_transactions_get",
    {
      path: "/sub-organizations/{id}/billing/transactions",
      method: "GET",
      operationId: "Getusertransactions"
    }
  ]
])

/**
 * Get tool by name
 */
export function getTool(name: string): Tool | undefined {
  return generatedTools.find(t => t.name === name)
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): Tool[] {
  const names = toolCategories[category] || []
  return generatedTools.filter(t => names.includes(t.name))
}
