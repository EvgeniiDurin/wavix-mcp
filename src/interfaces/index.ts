/**
 * TypeScript Interfaces
 */

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

export interface SmsMessage {
  id: string
  from: string
  to: string
  message: string
  status: "pending" | "sent" | "delivered" | "failed"
  createdAt: string
}

export interface CallRecord {
  id: string
  from: string
  to: string
  duration: number
  status: "initiated" | "ringing" | "answered" | "completed" | "failed"
  startedAt: string
  endedAt?: string
}

export interface PhoneNumber {
  id: string
  number: string
  country: string
  capabilities: ("sms" | "voice" | "mms")[]
  status: "active" | "inactive"
}
