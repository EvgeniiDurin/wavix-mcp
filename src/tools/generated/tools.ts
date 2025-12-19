/**
 * Generated Grouped MCP Tools from OpenAPI
 *
 * AUTO-GENERATED - DO NOT EDIT
 * Generated at: 2025-12-18T17:00:14.542Z
 * Source: ./api/wavix-api.yaml
 *
 * Each tool represents a group of related operations with an "action" parameter
 *
 * Run: pnpm generate:tools
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js"

export interface ActionMeta {
  path: string
  method: string
  operationId: string
  requiredParams: string[]
}

export interface ToolMetaInfo {
  /** Map of action name to endpoint metadata */
  actions: Record<string, ActionMeta>
}

/**
 * Tool categories for organization
 */
export const toolCategories: Record<string, string[]> = {
  "SIP trunks": ["sip_trunks"],
  Buy: ["buy_numbers"],
  Cart: ["cart"],
  "My numbers": ["numbers"],
  CDRs: ["cdrs"],
  "Call recording": ["recordings"],
  "Speech Analytics": ["speech_analytics"],
  "Call webhooks": ["call_webhooks"],
  "Call control": ["calls"],
  "Wavix Embeddable": ["webrtc_tokens"],
  "SMS and MMS": ["sms", "sms_sender_ids"],
  "10DLC": ["10dlc_brands", "10dlc_campaigns"],
  "Number Validator": ["validation"],
  "Voice campaigns": ["voice_campaigns"],
  "Link shortener": ["short_links"],
  "2FA": ["two_fa"],
  Billing: ["billing"],
  Profile: ["profile"],
  "Sub-accounts": ["sub_accounts"],
  Config: ["config"]
}

/**
 * All generated MCP tools (grouped by entity)
 */
export const generatedTools: Tool[] = [
  {
    name: "sip_trunks",
    description: "Manage SIP trunks: list all trunks, create new trunk, get/update/delete by ID",
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
        },
        id: {
          type: "integer",
          description: "SIP trunk ID",
          format: "int32"
        },
        action: {
          type: "string",
          enum: ["list", "create", "get", "update", "delete"],
          description:
            "Action to perform: list (List SIP trunks on the account), create (Create a new SIP trunk, requires: label, password, callerid, ip_restrict, didinfo_enabled, call_restrict, cost_limit, channels_restrict, rewrite_enabled, transcription_enabled, transcription_threshold), get (Get a SIP trunk configuration, requires: id), update (Update a SIP trunk configuration, requires: id, label, password, callerid, ip_restrict, didinfo_enabled, call_restrict, cost_limit, channels_restrict, rewrite_enabled, transcription_enabled, transcription_threshold), delete (Delete a SIP trunk, requires: id)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "buy_numbers",
    description: "Browse available phone numbers: list countries, regions, cities, and available DIDs",
    inputSchema: {
      type: "object",
      properties: {
        text_enabled_only: {
          type: "boolean",
          description: "Retrieve countries with text-enabled phone numbers only"
        },
        country: {
          type: "integer",
          description: "Country unique ID",
          format: "int32"
        },
        region: {
          type: "integer",
          description: "Region ID",
          format: "int32"
        },
        city: {
          type: "integer",
          description: "City ID",
          format: "int32"
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
        },
        action: {
          type: "string",
          enum: ["countries", "regions", "cities", "region_cities", "available"],
          description:
            "Action to perform: countries (Get a list of countries), regions (Get a list of regions, requires: country), cities (Get a list of cities in a country, requires: country), region_cities (Get a list of cities in a region, requires: country, region), available (Get numbers available for purchase, requires: country, city)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "cart",
    description: "Manage shopping cart: view cart, add/remove items, clear cart, checkout",
    inputSchema: {
      type: "object",
      properties: {
        ids: {
          type: "array",
          description: "Comma-separated list of numbers to add to the cart",
          items: {
            type: "string"
          }
        },
        action: {
          type: "string",
          enum: ["get", "update", "clear", "checkout"],
          description:
            "Action to perform: get (Get cart content), update (Add phone numbers to the cart, requires: ids), clear (Remove numbers from the cart), checkout (Check out numbers, requires: ids)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "numbers",
    description: "Manage your phone numbers (DIDs): list, get details, update settings, delete, upload papers",
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
        },
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
        },
        ids: {
          type: "array",
          description: "An array of phone number IDs to release from your account"
        },
        dids: {
          type: "string",
          description:
            'A comma-separated string of phone numbers to release from your account (e.g., "47832123321,47832123324,47832123325")'
        },
        sms_enabled: {
          type: "boolean",
          description: "Turn inbound SMS support on or off for the number."
        },
        destinations: {
          type: "array",
          description: "An array of inbound call destinations to be set up on the phone number",
          items: {
            type: "object"
          }
        },
        action: {
          type: "string",
          enum: ["list", "get", "update", "delete", "update_sms", "update_destinations", "upload_papers"],
          description:
            "Action to perform: list (Get numbers on the account), get (Get a specific number details, requires: id), update (Update a specific number, requires: id), delete (Return numbers to stock), update_sms (SMS-enable a specific number, requires: sms_enabled, id), update_destinations (Update inbound call destinations, requires: ids, destinations, sms_relay_url), upload_papers (Upload a document for numbers)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "cdrs",
    description: "Access call detail records: list CDRs, get details, export, manage transcriptions",
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
          type: "string",
          description:
            "Filter calls by disposition. In case the parameter is not specified, only answered calls are returned. To get all calls regardless their disposition pass `all` as the parameter value",
          enum: ["answered", "noanswer", "busy", "failed", "all"]
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
        },
        show_transcription: {
          type: "boolean",
          description: "Include transcription information in the response"
        },
        min_duration: {
          type: "integer",
          description: "Filter results by minimum call duration, in seconds",
          format: "int32"
        },
        transcription: {
          type: "object"
        },
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
        },
        action: {
          type: "string",
          enum: ["list", "list_all", "get", "export", "retranscribe", "transcription"],
          description:
            "Action to perform: list (Get CDRs on the account, requires: from, to, type), list_all (Get CDRs in NDJSON format, requires: from, to, type), get (Get details of a specific call, requires: uuid), export (Search for calls containing specific keywords or phrases, requires: type, from, to, page, per_page), retranscribe (Transcribe a single call, requires: cdr_uuid), transcription (Request transcription for a specific call, requires: cdr_uuid)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "recordings",
    description: "Manage call recordings: list recordings, get by CDR UUID, delete",
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
        },
        cdr_uuid: {
          type: "string",
          description: "Call ID."
        },
        id: {
          type: "integer",
          description: "Call recording ID",
          format: "int32"
        },
        action: {
          type: "string",
          enum: ["list", "get", "delete"],
          description:
            "Action to perform: list (List call recordings), get (Get a specific call recording, requires: cdr_uuid), delete (Delete a specific recording, requires: id)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "speech_analytics",
    description: "Manage speech analytics: create analysis, get/update results, download files",
    inputSchema: {
      type: "object",
      properties: {
        uuid: {
          type: "string",
          description: "Transcription request ID"
        },
        callback_url: {
          type: "string",
          description: "Webhook URL where transcription status updates are sent"
        },
        insights: {
          type: "boolean",
          description: "Enable insights generation for the transcription"
        },
        action: {
          type: "string",
          enum: ["create", "get", "update", "download"],
          description:
            "Action to perform: create (Upload a file for transcription), get (Query a specific transcription, requires: uuid), update (Retranscribe an uploaded file, requires: uuid, callback_url), download (Retrieve the original file, requires: uuid)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "call_webhooks",
    description: "Manage call webhooks: get current settings, create/update webhooks, delete",
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
        },
        action: {
          type: "string",
          enum: ["get", "create", "delete"],
          description:
            "Action to perform: get (List configured webhooks), create (Create a webhook, requires: url, event_type), delete (Delete a webhook, requires: event_type)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "calls",
    description:
      "Control calls: initiate calls, list active calls, get call details, answer, hangup, play audio, collect DTMF, manage streams",
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
        },
        uuid: {
          type: "string",
          description: "Call ID.",
          format: "uuid"
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
        },
        audio_file: {
          type: "string",
          description: "URL of the audio file to play"
        },
        delay_before_playing: {
          type: "integer",
          description: "Delay before playing the audio, in milliseconds"
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
        },
        stream_uuid: {
          type: "string",
          description: "Stream ID.",
          format: "uuid"
        },
        action: {
          type: "string",
          enum: [
            "create",
            "list",
            "get",
            "hangup",
            "answer",
            "play",
            "audio_delete",
            "collect_dtmf",
            "stream_start",
            "stream_stop"
          ],
          description:
            "Action to perform: create (Start a new call, requires: from, to), list (Fetch active calls), get (Get a specific call details, requires: uuid), hangup (End a call, requires: uuid), answer (Answer an inbound call, requires: uuid), play (Play audio during a call, requires: uuid, audio_file), audio_delete (Stop audio playback, requires: uuid), collect_dtmf (Collect DTMF input, requires: uuid), stream_start (Start call streaming, requires: uuid, stream_url, stream_type, stream_channel), stream_stop (Stop call streaming, requires: uuid, stream_uuid)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "webrtc_tokens",
    description: "Manage WebRTC tokens for Wavix Embeddable: list, create, get, update, delete tokens",
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
        },
        uuid: {
          type: "string",
          description: "Token ID.",
          format: "uuid"
        },
        action: {
          type: "string",
          enum: ["list", "create", "get", "update", "delete"],
          description:
            "Action to perform: list (Get active widget tokens), create (Generate a Wavix Embeddable Widget token, requires: sip_trunk), get (Get a Wavix Embeddable Widget token, requires: uuid), update (Update a widget token payload, requires: uuid, payload), delete (Delete a Wavix Embeddable Widget token, requires: uuid)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "sms",
    description:
      "Send and manage SMS/MMS messages: send messages, list sent/received, get message details, manage opt-outs",
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
        },
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
        status: {
          type: "string",
          description: "Filter messages by message delivery status.",
          enum: ["accepted", "pending", "sent", "delivered", "undelivered", "expired", "rejected", "dlr_expired"]
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
        },
        id: {
          type: "string",
          description: "Unique identifier of the message"
        },
        opt_out: {
          type: "object"
        },
        action: {
          type: "string",
          enum: ["send", "list", "list_all", "get", "opt_out"],
          description:
            "Action to perform: send (Send SMS or MMS message, requires: from, to, message_body), list (Get messages on your account, requires: type), list_all (Get messages in NDJSON format, requires: type), get (Get a specific message, requires: id), opt_out (Unsubscribe a phone number from SMS messages, requires: opt_out)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "sms_sender_ids",
    description: "Manage SMS sender IDs: list, create, get details, delete sender IDs",
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
        },
        id: {
          type: "string",
          description: "Unique identifier of a Sender ID",
          format: "uuid"
        },
        action: {
          type: "string",
          enum: ["list", "create", "get", "delete"],
          description:
            "Action to perform: list (List Sender IDs), create (Create a new Sender ID, requires: sender_id, type, countries, usecase), get (Get a Sender ID, requires: id), delete (Delete a Sender ID, requires: id)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "10dlc_brands",
    description:
      "Manage 10DLC brands: register/update brands, manage evidence documents, request vetting, check use case eligibility",
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
        brand_id: {
          type: "string",
          description: "Unique identifier of a Brand"
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
        },
        uuid: {
          type: "string",
          description: "Evidence UUID"
        },
        evp_id: {
          type: "string",
          description: "External vetting provider code"
        },
        vetting_class: {
          type: "string",
          description: "The vetting class"
        },
        vetting_id: {
          type: "string",
          description: "The vetting unique identifier"
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
        },
        action: {
          type: "string",
          enum: [
            "list",
            "create",
            "get",
            "update",
            "delete",
            "appeals_list",
            "appeal_create",
            "evidence_list",
            "evidence_upload",
            "evidence_get",
            "evidence_delete",
            "vetting_list",
            "vetting_create",
            "vetting_appeal_create",
            "vetting_appeal_list",
            "usecase_get"
          ],
          description:
            "Action to perform: list (List 10DLC Brands on your account), create (Register a 10DLC Brand, requires: dba_name, company_name, entity_type, vertical, ein_taxid, ein_taxid_country, first_name, last_name, phone_number, email, street_address, city, state_or_province, country, zip), get (Query a specific 10DLC Brand on your account, requires: brand_id), update (Update a 10DLC Brand, requires: brand_id), delete (Delete a 10DLC Brand, requires: brand_id), appeals_list (List a 10DLC Brand Identity verification appeals, requires: brand_id), appeal_create (Appeal a 10DLC Brand Identity verification, requires: brand_id, appeal_categories, evidence), evidence_list (List a 10DLC Brand appeal evidence, requires: brand_id), evidence_upload (Upload a 10DLC Brand evidence, requires: brand_id), evidence_get (Download a specific 10DLC Brand appeal evidence, requires: brand_id, uuid), evidence_delete (Delete a 10DLC Brand appeal evidence, requires: brand_id, uuid), vetting_list (List 10DLC Brand external vettings, requires: brand_id), vetting_create (Request external vetting for a 10DLC Brand, requires: brand_id, evp_id, vetting_class), vetting_appeal_create (Appeal an external vetting for a 10DLC Brand, requires: brand_id, appeal_categories, evidence), vetting_appeal_list (List external vetting appeals for a 10DLC Brand, requires: brand_id), usecase_get (Qualify a 10DLC Brand for a use case, requires: brand_id, use_case)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "10dlc_campaigns",
    description: "Manage 10DLC campaigns: create/update campaigns, nudge for approval, manage event subscriptions",
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
        },
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
        privacy_policy: {
          type: "string",
          description: "A link to the Campaign privacy policy"
        },
        terms_conditions: {
          type: "string",
          description: "A link to the Campaign terms and conditions"
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
        subscription_category: {
          type: "string",
          description: "The Wavix 10DLC event type. Can be one of the following: `brand`, `campaign`, or `number`."
        },
        url: {
          type: "string",
          description: "A webhook URL to send events to"
        },
        action: {
          type: "string",
          enum: [
            "list",
            "list_by_brand",
            "create",
            "get",
            "update",
            "delete",
            "nudge",
            "subscriptions_list",
            "subscriptions_create",
            "subscriptions_delete"
          ],
          description:
            "Action to perform: list (List all 10DLC Campaigns on your account), list_by_brand (List all 10DLC Campaigns associated with a Brand, requires: brand_id), create (Register a 10DLC Campaign, requires: brand_id, affiliate_marketing, age_gated, auto_renewal, direct_lending, embedded_links, embedded_phones, embedded_link_sample, description, optin_workflow, help, help_keywords, help_message, optin, optin_keywords, optin_message, optout, optout_keywords, optout_message, name, sample1, sample2, sample3, sample4, sample5, mock, usecase, terms_conditions), get (Query a specific 10DLC Campaign, requires: brand_id, campaign_id), update (Update a 10DLC Campaign, requires: brand_id, campaign_id), delete (Delete a 10DLC Campaign, requires: brand_id, campaign_id), nudge (Nudge a carrier to review the campaign, requires: brand_id, campaign_id, nudge_intent, description), subscriptions_list (List Wavix 10DLC event subscriptions), subscriptions_create (Subscribe to Wavix 10DLC events, requires: subscription_category, url), subscriptions_delete (Delete a Wavix 10DLC event subscription, requires: subscription_category)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "validation",
    description: "Validate phone numbers: validate single number, batch validate, get async results",
    inputSchema: {
      type: "object",
      properties: {
        phone_number: {
          type: "string",
          description: "Phone number to validate. May be formatted with or without the “+” leading sign."
        },
        type: {
          type: "string",
          description: "Validation type",
          enum: ["format", "analysis", "validation"]
        },
        phone_numbers: {
          type: "array",
          description: "An array of phone numbers to get detailed information about",
          items: {
            type: "string"
          }
        },
        async: {
          type: "boolean",
          description: "Indicates whether the request should be executed asynchronously. The default value is false."
        },
        force: {
          type: "boolean",
          description: "Force"
        },
        uuid: {
          type: "string",
          description: "Unique validation token"
        },
        action: {
          type: "string",
          enum: ["list", "create", "get"],
          description:
            "Action to perform: list (Validate a single phone number, requires: phone_number, type), create (Validate multiple phone numbers, requires: phone_numbers, type, async, force), get (Get asynchronous validation results, requires: uuid)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "voice_campaigns",
    description: "Manage voice campaigns: create campaigns, get campaign details and status",
    inputSchema: {
      type: "object",
      properties: {
        voice_campaign: {
          type: "object"
        },
        id: {
          type: "integer",
          description: "Voice campaign ID",
          format: "int32"
        },
        action: {
          type: "string",
          enum: ["create", "get"],
          description:
            "Action to perform: create (Trigger a scenario, requires: voice_campaign), get (Get a specific voice campaign, requires: id)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "short_links",
    description: "Manage short links: create shortened URLs, view click metrics",
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
        },
        from: {
          type: "string",
          description: "Start date of your search time range, in `yyyy-mm-dd` format."
        },
        to: {
          type: "string",
          description: "End date of your search time range, in `yyyy-mm-dd` format."
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
        },
        action: {
          type: "string",
          enum: ["create", "metrics"],
          description:
            "Action to perform: create (Create a short link, requires: link), metrics (Get metrics for short links, requires: from, to)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "two_fa",
    description: "Two-factor authentication: send verification codes, check codes, cancel verifications, view sessions",
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
        },
        session_uuid: {
          type: "string",
          description: "Wavix 2FA Verification ID"
        },
        service_uuid: {
          type: "string",
          description: "Wavix 2FA Service ID"
        },
        from: {
          type: "string",
          description: "Start date of your search time range, in `yyyy-mm-dd` format",
          format: "date"
        },
        code: {
          type: "string",
          description: "The code entered by an end user"
        },
        action: {
          type: "string",
          enum: ["send", "resend", "sessions", "check", "cancel"],
          description:
            "Action to perform: send (Create a new 2FA Verification, requires: service_id, to, channel), resend (Resend a verification code, requires: session_uuid, channel), sessions (List Wavix 2FA Verifications, requires: service_uuid, from, to), check (Validate a code, requires: session_uuid, code), cancel (Cancel a 2FA Verification, requires: session_uuid)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "billing",
    description: "Access billing information: view transactions, download invoices/statements",
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
          type: "integer",
          enum: [
            0, 2, 3, 6, 11, 14, 15, 19, 20, 23, 24, 25, 26, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43,
            44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60
          ]
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
        },
        id: {
          type: "integer",
          description: "Unique identifier of the statement",
          format: "int32"
        },
        action: {
          type: "string",
          enum: ["transactions", "invoices", "invoice_download"],
          description:
            "Action to perform: transactions (Get transactions on the account, requires: from_date, to_date), invoices (Get statements on the account), invoice_download (Download a statement, requires: id)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "profile",
    description:
      "Manage account profile. Actions: get (profile info: name, email, company), update (modify profile), config (account balance and limits)",
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
        },
        action: {
          type: "string",
          enum: ["get", "update", "config"],
          description:
            "Action to perform: get (Get customer info), update (Update customer info), config (Get account settings)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "sub_accounts",
    description: "Manage sub-accounts: list, create, get/update details, view billing transactions",
    inputSchema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description: "Filter by account status",
          enum: ["enabled", "disabled"]
        },
        name: {
          type: "string",
          description: "Company name"
        },
        default_destinations: {
          type: "object",
          description: "Default webhook URLs for inbound messages and delivery reports"
        },
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
        },
        action: {
          type: "string",
          enum: ["list", "create", "get", "update", "transactions"],
          description:
            "Action to perform: list (Get sub-accounts), create (Create a new sub-account, requires: name), get (Get a specific sub-account, requires: id), update (Update a sub-account, requires: id, name), transactions (List transactions for a sub-account, requires: id, from_date, to_date)"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "config",
    description: "Manage MCP server configuration: get/set API base URL dynamically",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The new API base URL (e.g., https://api.wavix.com)"
        },
        action: {
          type: "string",
          enum: ["get_api_url", "set_api_url"],
          description:
            "Action to perform: get_api_url (Manage configuration), set_api_url (Manage configuration, requires: url)"
        }
      },
      required: ["action"]
    }
  }
]

/**
 * Metadata mapping tool names to action endpoints
 */
export const toolMeta: Record<string, ToolMetaInfo> = {
  sip_trunks: {
    actions: {
      list: {
        path: "/v1/trunks",
        method: "GET",
        operationId: "ListSIPtrunksontheaccount",
        requiredParams: []
      },
      create: {
        path: "/v1/trunks",
        method: "POST",
        operationId: "CreateanewSIPtrunk",
        requiredParams: [
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
      },
      get: {
        path: "/v1/trunks/{id}",
        method: "GET",
        operationId: "GetSIPtrunkconfiguration",
        requiredParams: ["id"]
      },
      update: {
        path: "/v1/trunks/{id}",
        method: "PUT",
        operationId: "UpdateaSIPtrunk",
        requiredParams: [
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
      },
      delete: {
        path: "/v1/trunks/{id}",
        method: "DELETE",
        operationId: "DeleteaSIPtrunk",
        requiredParams: ["id"]
      }
    }
  },
  buy_numbers: {
    actions: {
      countries: {
        path: "/v1/buy/countries",
        method: "GET",
        operationId: "Getalistofcountries",
        requiredParams: []
      },
      regions: {
        path: "/v1/buy/countries/{country}/regions",
        method: "GET",
        operationId: "Getalistofregions",
        requiredParams: ["country"]
      },
      cities: {
        path: "/v1/buy/countries/{country}/cities",
        method: "GET",
        operationId: "Getalistofcitiesinacountry",
        requiredParams: ["country"]
      },
      region_cities: {
        path: "/v1/buy/countries/{country}/regions/{region}/cities",
        method: "GET",
        operationId: "Getalistofcitiesinaregion",
        requiredParams: ["country", "region"]
      },
      available: {
        path: "/v1/buy/countries/{country}/cities/{city}/dids",
        method: "GET",
        operationId: "Getnumbersavailableforpurchase",
        requiredParams: ["country", "city"]
      }
    }
  },
  cart: {
    actions: {
      get: {
        path: "/v1/buy/cart",
        method: "GET",
        operationId: "Getcartcontent",
        requiredParams: []
      },
      update: {
        path: "/v1/buy/cart",
        method: "PUT",
        operationId: "AddDIDnumberstothecart",
        requiredParams: ["ids"]
      },
      clear: {
        path: "/v1/buy/cart",
        method: "DELETE",
        operationId: "Removenumbersfromthecart",
        requiredParams: []
      },
      checkout: {
        path: "/v1/buy/cart/checkout",
        method: "POST",
        operationId: "CheckoutDIDnumbers",
        requiredParams: ["ids"]
      }
    }
  },
  numbers: {
    actions: {
      list: {
        path: "/v1/mydids",
        method: "GET",
        operationId: "GetDIDsontheaccount",
        requiredParams: []
      },
      get: {
        path: "/v1/mydids/{id}",
        method: "GET",
        operationId: "GetaspecificDID",
        requiredParams: ["id"]
      },
      update: {
        path: "/v1/mydids/{id}",
        method: "PUT",
        operationId: "UpdateaspecificDID",
        requiredParams: ["id"]
      },
      delete: {
        path: "/v1/mydids",
        method: "DELETE",
        operationId: "ReturnDIDstostock",
        requiredParams: []
      },
      update_sms: {
        path: "/v1/mydids/update-sms-enabled",
        method: "PUT",
        operationId: "UpdateSMSenabledstatusforaDID",
        requiredParams: ["sms_enabled", "id"]
      },
      update_destinations: {
        path: "/v1/mydids/update-destinations",
        method: "POST",
        operationId: "UpdateDIDdestinations",
        requiredParams: ["ids", "destinations", "sms_relay_url"]
      },
      upload_papers: {
        path: "/v1/mydids/papers",
        method: "POST",
        operationId: "UploadadocumentfortheDID",
        requiredParams: []
      }
    }
  },
  cdrs: {
    actions: {
      list: {
        path: "/v1/cdr",
        method: "GET",
        operationId: "GetCDRsontheaccount",
        requiredParams: ["from", "to", "type"]
      },
      list_all: {
        path: "/v1/cdr/all",
        method: "GET",
        operationId: "GetallCDRrecordsasNDJSONstream",
        requiredParams: ["from", "to", "type"]
      },
      get: {
        path: "/v1/cdr/{uuid}",
        method: "GET",
        operationId: "Getcalldetailsofaspecificcall",
        requiredParams: ["uuid"]
      },
      export: {
        path: "/v1/cdr",
        method: "POST",
        operationId: "Searchforcallscontainingspecifickeywordsorphrases",
        requiredParams: ["type", "from", "to", "page", "per_page"]
      },
      retranscribe: {
        path: "/v1/cdr/{cdr_uuid}/retranscribe",
        method: "PUT",
        operationId: "Transcribeasinglecall",
        requiredParams: ["cdr_uuid"]
      },
      transcription: {
        path: "/v1/cdr/{cdr_uuid}/transcription",
        method: "GET",
        operationId: "Requesttranscriptionforaspecificcall",
        requiredParams: ["cdr_uuid"]
      }
    }
  },
  recordings: {
    actions: {
      list: {
        path: "/v1/recordings",
        method: "GET",
        operationId: "Getcallrecordings",
        requiredParams: []
      },
      get: {
        path: "/v1/recordings/{cdr_uuid}",
        method: "GET",
        operationId: "Getcallrecordingbycdruuid",
        requiredParams: ["cdr_uuid"]
      },
      delete: {
        path: "/v1/recordings/{id}",
        method: "DELETE",
        operationId: "Deletecallrecording",
        requiredParams: ["id"]
      }
    }
  },
  speech_analytics: {
    actions: {
      create: {
        path: "/v1/speech-analytics",
        method: "POST",
        operationId: "Submitafilefortranscription",
        requiredParams: []
      },
      get: {
        path: "/v1/speech-analytics/{uuid}",
        method: "GET",
        operationId: "Queryaspecifictranscription",
        requiredParams: ["uuid"]
      },
      update: {
        path: "/v1/speech-analytics/{uuid}",
        method: "PUT",
        operationId: "Retranscribeaudiofile",
        requiredParams: ["uuid", "callback_url"]
      },
      download: {
        path: "/v1/speech-analytics/{uuid}/file",
        method: "GET",
        operationId: "Gettranscriptionfile",
        requiredParams: ["uuid"]
      }
    }
  },
  call_webhooks: {
    actions: {
      get: {
        path: "/v1/call/webhooks",
        method: "GET",
        operationId: "Getcallwebhooks",
        requiredParams: []
      },
      create: {
        path: "/v1/call/webhooks",
        method: "POST",
        operationId: "Createcallwebhook",
        requiredParams: ["url", "event_type"]
      },
      delete: {
        path: "/v1/call/webhooks",
        method: "DELETE",
        operationId: "Deletecallwebhook",
        requiredParams: ["event_type"]
      }
    }
  },
  calls: {
    actions: {
      create: {
        path: "/v1/call",
        method: "POST",
        operationId: "StartCall",
        requiredParams: ["from", "to"]
      },
      list: {
        path: "/v1/call",
        method: "GET",
        operationId: "GetUserCalls",
        requiredParams: []
      },
      get: {
        path: "/v1/call/{uuid}",
        method: "GET",
        operationId: "GetUserCall",
        requiredParams: ["uuid"]
      },
      hangup: {
        path: "/v1/call/{uuid}",
        method: "DELETE",
        operationId: "TerminateCall",
        requiredParams: ["uuid"]
      },
      answer: {
        path: "/v1/call/{uuid}/answer",
        method: "POST",
        operationId: "AnswerCall",
        requiredParams: ["uuid"]
      },
      play: {
        path: "/v1/call/{uuid}/play",
        method: "POST",
        operationId: "PlayAudio",
        requiredParams: ["uuid", "audio_file"]
      },
      audio_delete: {
        path: "/v1/call/{uuid}/audio",
        method: "DELETE",
        operationId: "StopAudio",
        requiredParams: ["uuid"]
      },
      collect_dtmf: {
        path: "/v1/call/{uuid}/collect",
        method: "POST",
        operationId: "CollectDtmf",
        requiredParams: ["uuid"]
      },
      stream_start: {
        path: "/v1/call/{uuid}/streams",
        method: "POST",
        operationId: "StartCallStreaming",
        requiredParams: ["uuid", "stream_url", "stream_type", "stream_channel"]
      },
      stream_stop: {
        path: "/v1/call/{uuid}/streams/{stream_uuid}",
        method: "DELETE",
        operationId: "DeleteCallStream",
        requiredParams: ["uuid", "stream_uuid"]
      }
    }
  },
  webrtc_tokens: {
    actions: {
      list: {
        path: "/v2/webrtc/tokens",
        method: "GET",
        operationId: "GetActiveWidgetTokens",
        requiredParams: []
      },
      create: {
        path: "/v2/webrtc/tokens",
        method: "POST",
        operationId: "GenerateWidgetToken",
        requiredParams: ["sip_trunk"]
      },
      get: {
        path: "/v2/webrtc/tokens/{uuid}",
        method: "GET",
        operationId: "GetWidgetTokenInfo",
        requiredParams: ["uuid"]
      },
      update: {
        path: "/v2/webrtc/tokens/{uuid}",
        method: "PUT",
        operationId: "ManageWidgetTokenPayload",
        requiredParams: ["uuid", "payload"]
      },
      delete: {
        path: "/v2/webrtc/tokens/{uuid}",
        method: "DELETE",
        operationId: "DeleteWidgetToken",
        requiredParams: ["uuid"]
      }
    }
  },
  sms: {
    actions: {
      send: {
        path: "/v3/messages",
        method: "POST",
        operationId: "SendSMSorMMSmessage",
        requiredParams: ["from", "to", "message_body"]
      },
      list: {
        path: "/v3/messages",
        method: "GET",
        operationId: "Getmessagesonyouraccount",
        requiredParams: ["type"]
      },
      list_all: {
        path: "/v3/messages/all",
        method: "GET",
        operationId: "Getallmessages",
        requiredParams: ["type"]
      },
      get: {
        path: "/v3/messages/{id}",
        method: "GET",
        operationId: "Getaspecificmessage",
        requiredParams: ["id"]
      },
      opt_out: {
        path: "/v3/messages/opt_outs",
        method: "POST",
        operationId: "Opt-outaphonenumberofSMSmessages",
        requiredParams: ["opt_out"]
      }
    }
  },
  sms_sender_ids: {
    actions: {
      list: {
        path: "/v3/messages/sender_ids",
        method: "GET",
        operationId: "ListSenderIDsontheaccount",
        requiredParams: []
      },
      create: {
        path: "/v3/messages/sender_ids",
        method: "POST",
        operationId: "ProvisionanewSenderID",
        requiredParams: ["sender_id", "type", "countries", "usecase"]
      },
      get: {
        path: "/v3/messages/sender_ids/{id}",
        method: "GET",
        operationId: "GetSenderIDById",
        requiredParams: ["id"]
      },
      delete: {
        path: "/v3/messages/sender_ids/{id}",
        method: "DELETE",
        operationId: "DeleteaSenderID",
        requiredParams: ["id"]
      }
    }
  },
  "10dlc_brands": {
    actions: {
      list: {
        path: "/v3/10dlc/brands",
        method: "GET",
        operationId: "List10DLCBrandsonyouraccount",
        requiredParams: []
      },
      create: {
        path: "/v3/10dlc/brands",
        method: "POST",
        operationId: "Registera10DLCBrand",
        requiredParams: [
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
      },
      get: {
        path: "/v3/10dlc/brands/{brand_id}",
        method: "GET",
        operationId: "Queryaspecific10DLCBrandonyouraccount",
        requiredParams: ["brand_id"]
      },
      update: {
        path: "/v3/10dlc/brands/{brand_id}",
        method: "PUT",
        operationId: "Updatea10DLCBrand",
        requiredParams: ["brand_id"]
      },
      delete: {
        path: "/v3/10dlc/brands/{brand_id}",
        method: "DELETE",
        operationId: "Deletea10DLCBrand",
        requiredParams: ["brand_id"]
      },
      appeals_list: {
        path: "/v3/10dlc/brands/{brand_id}/appeals",
        method: "GET",
        operationId: "Lista10DLCBrandIdentityverificationappeals",
        requiredParams: ["brand_id"]
      },
      appeal_create: {
        path: "/v3/10dlc/brands/{brand_id}/appeals",
        method: "POST",
        operationId: "Appeala10DLCBrandIdentityverification",
        requiredParams: ["brand_id", "appeal_categories", "evidence"]
      },
      evidence_list: {
        path: "/v3/10dlc/brands/{brand_id}/evidence",
        method: "GET",
        operationId: "Lista10DLCBrandappealevidence",
        requiredParams: ["brand_id"]
      },
      evidence_upload: {
        path: "/v3/10dlc/brands/{brand_id}/evidence",
        method: "POST",
        operationId: "Uploada10DLCBrandevidence",
        requiredParams: ["brand_id"]
      },
      evidence_get: {
        path: "/v3/10dlc/brands/{brand_id}/evidence/{uuid}",
        method: "GET",
        operationId: "Downloadaspecific10DLCBrandappealevidence",
        requiredParams: ["brand_id", "uuid"]
      },
      evidence_delete: {
        path: "/v3/10dlc/brands/{brand_id}/evidence/{uuid}",
        method: "DELETE",
        operationId: "Deletea10DLCBrandappealevidence",
        requiredParams: ["brand_id", "uuid"]
      },
      vetting_list: {
        path: "/v3/10dlc/brands/{brand_id}/vettings",
        method: "GET",
        operationId: "List10DLCBrandexternalvettings",
        requiredParams: ["brand_id"]
      },
      vetting_create: {
        path: "/v3/10dlc/brands/{brand_id}/vettings",
        method: "POST",
        operationId: "Requestexternalvettingfora10DLCBrand",
        requiredParams: ["brand_id", "evp_id", "vetting_class"]
      },
      vetting_appeal_create: {
        path: "/v3/10dlc/brands/{brand_id}/vettings/appeals",
        method: "POST",
        operationId: "Appealanexternalvettingfora10DLCBrand",
        requiredParams: ["brand_id", "appeal_categories", "evidence"]
      },
      vetting_appeal_list: {
        path: "/v3/10dlc/brands/{brand_id}/vettings/appeals",
        method: "GET",
        operationId: "Listexternalvettingappealsfora10DLCBrand",
        requiredParams: ["brand_id"]
      },
      usecase_get: {
        path: "/v3/10dlc/brands/{brand_id}/usecases/{use_case}",
        method: "GET",
        operationId: "Qualifya10DLCBrandforausecase",
        requiredParams: ["brand_id", "use_case"]
      }
    }
  },
  "10dlc_campaigns": {
    actions: {
      list: {
        path: "/v3/10dlc/brands/campaigns",
        method: "GET",
        operationId: "Listall10DLCCampaignsonyouraccount",
        requiredParams: []
      },
      list_by_brand: {
        path: "/v3/10dlc/brands/{brand_id}/campaigns",
        method: "GET",
        operationId: "Listall10DLCCampaignsassociatedwithaBrand",
        requiredParams: ["brand_id"]
      },
      create: {
        path: "/v3/10dlc/brands/{brand_id}/campaigns",
        method: "POST",
        operationId: "Registera10DLCCampaign",
        requiredParams: [
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
      },
      get: {
        path: "/v3/10dlc/brands/{brand_id}/campaigns/{campaign_id}",
        method: "GET",
        operationId: "Queryaspecific10DLCCampaign",
        requiredParams: ["brand_id", "campaign_id"]
      },
      update: {
        path: "/v3/10dlc/brands/{brand_id}/campaigns/{campaign_id}",
        method: "PUT",
        operationId: "Updatea10DLCCampaign",
        requiredParams: ["brand_id", "campaign_id"]
      },
      delete: {
        path: "/v3/10dlc/brands/{brand_id}/campaigns/{campaign_id}",
        method: "DELETE",
        operationId: "Deletea10DLCCampaign",
        requiredParams: ["brand_id", "campaign_id"]
      },
      nudge: {
        path: "/v3/10dlc/brands/{brand_id}/campaigns/{campaign_id}/nudge",
        method: "POST",
        operationId: "Nudgeacarriertoreviewthecampaign",
        requiredParams: ["brand_id", "campaign_id", "nudge_intent", "description"]
      },
      subscriptions_list: {
        path: "/v3/10dlc/subscriptions",
        method: "GET",
        operationId: "ListWavix10DLCeventsubscriptions",
        requiredParams: []
      },
      subscriptions_create: {
        path: "/v3/10dlc/subscriptions",
        method: "POST",
        operationId: "SubscribetoWavix10DLCevents",
        requiredParams: ["subscription_category", "url"]
      },
      subscriptions_delete: {
        path: "/v3/10dlc/subscriptions",
        method: "DELETE",
        operationId: "DeleteaWavix10DLCeventsubscription",
        requiredParams: ["subscription_category"]
      }
    }
  },
  validation: {
    actions: {
      list: {
        path: "/v1/validation",
        method: "GET",
        operationId: "Validateasinglephonenumber",
        requiredParams: ["phone_number", "type"]
      },
      create: {
        path: "/v1/validation",
        method: "POST",
        operationId: "Validatemultiplephonenumbers",
        requiredParams: ["phone_numbers", "type", "async", "force"]
      },
      get: {
        path: "/v1/validation/{uuid}",
        method: "GET",
        operationId: "Getasynchronousvalidationresults",
        requiredParams: ["uuid"]
      }
    }
  },
  voice_campaigns: {
    actions: {
      create: {
        path: "/v1/voice-campaigns",
        method: "POST",
        operationId: "Triggerascenario",
        requiredParams: ["voice_campaign"]
      },
      get: {
        path: "/v1/voice-campaigns/{id}",
        method: "GET",
        operationId: "Getaspecificvoicecampaign",
        requiredParams: ["id"]
      }
    }
  },
  short_links: {
    actions: {
      create: {
        path: "/v1/short-links",
        method: "POST",
        operationId: "Createashortlink",
        requiredParams: ["link"]
      },
      metrics: {
        path: "/v1/short-links/metrics",
        method: "GET",
        operationId: "Getmetricsforshortlinks",
        requiredParams: ["from", "to"]
      }
    }
  },
  two_fa: {
    actions: {
      send: {
        path: "/v1/two-fa/verification",
        method: "POST",
        operationId: "Createanew2FAVerification",
        requiredParams: ["service_id", "to", "channel"]
      },
      resend: {
        path: "/v1/two-fa/verification/{session_uuid}",
        method: "POST",
        operationId: "Resendaverificationcode",
        requiredParams: ["session_uuid", "channel"]
      },
      sessions: {
        path: "/v1/two-fa/service/{service_uuid}/sessions",
        method: "GET",
        operationId: "ListWavix2FAVerifications",
        requiredParams: ["service_uuid", "from", "to"]
      },
      check: {
        path: "/v1/two-fa/verification/{session_uuid}/check",
        method: "POST",
        operationId: "Validateacode",
        requiredParams: ["session_uuid", "code"]
      },
      cancel: {
        path: "/v1/two-fa/verification/{session_uuid}/cancel",
        method: "PATCH",
        operationId: "Cancela2FAVerification",
        requiredParams: ["session_uuid"]
      }
    }
  },
  billing: {
    actions: {
      transactions: {
        path: "/v1/billing/transactions",
        method: "GET",
        operationId: "Gettransactionsontheaccount",
        requiredParams: ["from_date", "to_date"]
      },
      invoices: {
        path: "/v1/billing/invoices",
        method: "GET",
        operationId: "Getinvoicesontheaccount",
        requiredParams: []
      },
      invoice_download: {
        path: "/v1/billing/invoices/{id}",
        method: "GET",
        operationId: "Downloadaninvoice",
        requiredParams: ["id"]
      }
    }
  },
  profile: {
    actions: {
      get: {
        path: "/v1/profile",
        method: "GET",
        operationId: "Getcustomerinfo",
        requiredParams: []
      },
      update: {
        path: "/v1/profile",
        method: "PUT",
        operationId: "Updatecustomerinfo",
        requiredParams: []
      },
      config: {
        path: "/v1/profile/config",
        method: "GET",
        operationId: "Getaccountsettings",
        requiredParams: []
      }
    }
  },
  sub_accounts: {
    actions: {
      list: {
        path: "/v1/sub-organizations",
        method: "GET",
        operationId: "Getusers",
        requiredParams: []
      },
      create: {
        path: "/v1/sub-organizations",
        method: "POST",
        operationId: "Createuser",
        requiredParams: ["name"]
      },
      get: {
        path: "/v1/sub-organizations/{id}",
        method: "GET",
        operationId: "Getuserbyid",
        requiredParams: ["id"]
      },
      update: {
        path: "/v1/sub-organizations/{id}",
        method: "PUT",
        operationId: "Updateuser",
        requiredParams: ["id", "name"]
      },
      transactions: {
        path: "/v1/sub-organizations/{id}/billing/transactions",
        method: "GET",
        operationId: "Getusertransactions",
        requiredParams: ["id", "from_date", "to_date"]
      }
    }
  },
  config: {
    actions: {
      get_api_url: {
        path: "__config__/api_url",
        method: "GET",
        operationId: "config_get_api_url",
        requiredParams: []
      },
      set_api_url: {
        path: "__config__/api_url",
        method: "PUT",
        operationId: "config_set_api_url",
        requiredParams: ["url"]
      }
    }
  }
}

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

/**
 * Get action metadata for a tool
 */
export function getActionMeta(toolName: string, action: string): ActionMeta | undefined {
  return toolMeta[toolName]?.actions[action]
}
