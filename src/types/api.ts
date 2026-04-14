import type { UUID } from './common';

/**
 * Structured error context from BotX API responses
 */
export interface ErrorData {
  [key: string]: unknown;
  group_chat_id?: UUID;
  sync_id?: UUID;
  bot_id?: UUID;
  user_huid?: UUID;
  file_id?: UUID;
  error_description?: string;
  reason?: string;
  recipients_param?: UUID[];
  errors?: string[];
  link?: string;
  source_link?: string;
  location?: string;
}

/**
 * Standard BotX API response wrapper for successful results
 * @template T - Type of the result payload
 */
export interface SuccessResponse<T> {
  status: 'ok';
  result: T;
}

/**
 * Standard BotX API response wrapper for error results
 */
export interface ErrorResponse {
  status: 'error';
  reason: string;
  errors?: string[];
  error_data?: ErrorData;
}

/**
 * Union type for any BotX API response
 * @template T - Type of the result payload on success
 */
export type APIResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Generic request options for HTTP client
 * @template TBody - Type of the request body payload
 */
export interface RequestOptions<TBody = unknown> {
  body?: TBody;
  headers?: Record<string, string>;
  query_params?: Record<string, string | number | boolean | null>;
  use_auth?: boolean;
  content_type?: string;
  timeout_ms?: number;
}

/**
 * Multipart form field for file upload requests
 */
export interface MultipartField {
  name: string;
  value: string | Blob;
  filename?: string;
  content_type?: string;
}