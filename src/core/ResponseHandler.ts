import { create_api_error } from '../errors/BotXError';
import type { APIResponse, ErrorResponse } from '../types/api';

/**
 * Processes and normalizes BotX API responses with error mapping
 */
export class ResponseHandler {
  /**
   * Parse and validate API response, throwing typed errors for failures
   * @template T - Expected result type on success
   * @param response - Raw API response object
   * @returns Result payload on success
   * @throws BotXError subclass on error status
   */
  handle_response<T>(response: APIResponse<T>): T {
    if (response.status === 'ok') {
      return response.result as T;
    }

    const error_response = response as ErrorResponse;
    const error_message = error_response.error_data?.error_description || 'Unknown API error';
    throw create_api_error(error_response.reason || 'unknown_error', error_message, error_response.error_data);
  }

  /**
   * Safely handle response that may be success or error
   * @template T - Expected result type on success
   * @param response - Raw API response object
   * @returns Object with success flag and result or error details
   */
  handle_response_safe<T>(response: APIResponse<T>): { success: true; result: T } | { success: false; error: ErrorResponse } {
    if (response.status === 'ok') {
      return { success: true, result: response.result as T };
    }
    return { success: false, error: response as ErrorResponse };
  }

  /**
   * Extract sync_id from notification or event response
   * @param response - API response potentially containing sync_id
   * @returns Sync ID string or null if not present
   */
  extract_sync_id(response: APIResponse<{ sync_id?: string }>): string | null {
    if (response.status !== 'ok' || !response.result?.sync_id) {
      return null;
    }
    return response.result.sync_id;
  }

  /**
   * Check if response indicates specific error reason
   * @param response - API response object
   * @param reason - Error reason code to match
   * @returns True if response is error with matching reason
   */
  is_error_reason(response: APIResponse<unknown>, reason: string): boolean {
    return response.status === 'error' && response.reason === reason;
  }

  /**
   * Get structured error data from error response
   * @param response - API response object
   * @returns Error data object or null if not error response
   */
  get_error_data(response: APIResponse<unknown>): Record<string, unknown> | null {
    if (response.status !== 'error' || !response.error_data) {
      return null;
    }
    return response.error_data;
  }
}